# 🎮 VGamepadWeb.UI

> **IMPORTANT NOTE:** This repository contains **ONLY the UI / Client frontend**. For the virtual gamepad to function and emulate physical controllers in Windows (via ViGEmBus), you **must** run it alongside its dedicated **C# Backend Server**.

**VGamepadWeb** is an open-source project that transforms any web browser (on a smartphone, tablet, or secondary PC) into a professional, ultra-fast, and fully customizable virtual gamepad for playing PC games.

## ✨ Features

- **Ultra-Low Latency:** Uses **WebRTC Data Channels** to transmit button presses and joystick movements instantly, bypassing slower HTTP/WebSocket protocols for true real-time gaming.
- **Multiple Themes:** Choose between Xbox, PlayStation, and Nintendo layouts. Features authentic, high-quality controller glyphs powered by [PromptFont](https://shinmera.com/docs/promptfont).
- **Fully Customizable Layout:**
  - **Drag & Drop:** Move buttons and joysticks anywhere on the screen.
  - **Resize & Reshape:** Change the size of any control and toggle between circular or rectangular button shapes.
  - **Precision Nudge:** Fine-tune control positions pixel by pixel.
  - **Toggle Visibility:** Hide buttons you don't need for specific games.
  - **Show Hitboxes:** Visually reveal touch areas while editing to ensure perfect alignment.
- **Multiplayer Ready:** Supports dynamic Player ID assignment (P1, P2, P3, P4) synced directly from the backend server.
- **Haptic Feedback:** Receives live vibration signals over WebRTC and triggers your device's vibration motor instantly.
- **Profile Management:** Save multiple layouts for different games. Import and export profiles as JSON files to share them easily.

## 🛠️ Tech Stack

- **React + TypeScript:** For a robust, scalable, and responsive user interface.
- **Vite:** For ultra-fast development and optimized production builds.
- **WebRTC (`RTCDataChannel`):** Core technology for lag-free input transmission.
- **SignalR:** Used for initial WebRTC signaling (SDP/ICE candidate exchange) and live settings synchronization.
- **Vanilla CSS:** Custom Glassmorphism UI that feels premium and responsive, optimized for touch events without ghost-clicks or delays.

## 🚀 How to Run

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Open your terminal in the project directory and install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. A local link will be generated (e.g., `http://localhost:5173`). Open this link on your smartphone's browser (ensure both devices are on the same network).
5. **Start your C# Backend Server**, open the settings modal (⚙️) in the UI, and enter the server's IP address to connect and start playing!

## 📝 License
Please review the `LICENSE` file for details on commercial and personal usage rights.
