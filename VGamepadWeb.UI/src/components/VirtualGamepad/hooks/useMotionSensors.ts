import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook to capture device motion sensor data and send it via WebRTC DataChannel.
 * It uses a rate-limited approach (60Hz) to prevent flooding the network channel.
 * 
 * @param dataChannel The WebRTC RTCDataChannel used for transmission.
 */
export const useMotionSensors = (dataChannel: RTCDataChannel | null) => {
    // Silently cache the latest sensor values using a ref
    const sensorDataRef = useRef({
        gx: 0, gy: 0, gz: 0,
        ax: 0, ay: 0, az: 0
    });

    const [hasPermission, setHasPermission] = useState<boolean>(() => {
        // Assume true unless we specifically know we need to request it (iOS 13+)
        if (typeof (DeviceMotionEvent as any) !== 'undefined' && 
            typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            return false;
        }
        return true;
    });

    const requestPermission = useCallback(async () => {
        if (!window.isSecureContext) {
            console.warn("Device motion requires a secure context (HTTPS or localhost).");
            alert("تنبيه: مستشعرات الحركة تتطلب اتصال آمن (HTTPS) وقد لا تعمل على (HTTP) في بعض المتصفحات.");
        }

        if (typeof (DeviceMotionEvent as any) !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceMotionEvent as any).requestPermission();
                if (permissionState === 'granted') {
                    setHasPermission(true);
                } else {
                    console.error("Device motion permission denied");
                    alert("تم رفض إذن مستشعرات الحركة.");
                }
            } catch (error) {
                console.error("Error requesting device motion permission:", error);
            }
        } else {
            setHasPermission(true);
        }
    }, []);

    // 1. Capture data on 'devicemotion' event
    useEffect(() => {
        if (!hasPermission) return;

        const handleDeviceMotion = (event: DeviceMotionEvent) => {
            if (event.rotationRate) {
                // rotationRate (alpha, beta, gamma) -> gx, gy, gz
                sensorDataRef.current.gx = event.rotationRate.alpha || 0;
                sensorDataRef.current.gy = event.rotationRate.beta || 0;
                sensorDataRef.current.gz = event.rotationRate.gamma || 0;
            }
            if (event.accelerationIncludingGravity) {
                // accelerationIncludingGravity (x, y, z) -> ax, ay, az
                sensorDataRef.current.ax = event.accelerationIncludingGravity.x || 0;
                sensorDataRef.current.ay = event.accelerationIncludingGravity.y || 0;
                sensorDataRef.current.az = event.accelerationIncludingGravity.z || 0;
            }
        };

        window.addEventListener('devicemotion', handleDeviceMotion);

        return () => {
            window.removeEventListener('devicemotion', handleDeviceMotion);
        };
    }, [hasPermission]);

    // 2. Send data over WebRTC at ~60Hz (16ms interval)
    useEffect(() => {
        // Only start the interval if the data channel is available
        if (!dataChannel) return;

        const intervalId = setInterval(() => {
            // Ensure the channel is open before attempting to send
            if (dataChannel.readyState !== 'open') return;

            const { gx, gy, gz, ax, ay, az } = sensorDataRef.current;
            
            // Format numbers using .toFixed(2) to save bandwidth
            const formattedString = `M:${gx.toFixed(2)}:${gy.toFixed(2)}:${gz.toFixed(2)}:${ax.toFixed(2)}:${ay.toFixed(2)}:${az.toFixed(2)}`;
            
            try {
                dataChannel.send(formattedString);
            } catch (error) {
                console.error("Error sending motion data over dataChannel:", error);
            }
        }, 16);

        return () => {
            clearInterval(intervalId);
        };
    }, [dataChannel]);

    return { requestPermission, hasPermission };
};
