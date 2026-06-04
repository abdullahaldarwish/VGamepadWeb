import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

/* ═══════════════════ Types ═══════════════════ */
interface Pos { x: number; y: number; w?: number; h?: number; round?: boolean; hidden?: boolean }
interface GamepadLayout { version: number; controls: Record<string, Pos> }

/* ═══════════════════ Config ═══════════════════ */
const LAYOUT_KEY = 'gamepad_layout_v2';
const URL_KEY = 'gamepad_server_url';

type ThemeType = 'xbox' | 'ps' | 'nintendo';

interface BtnCfg { label: string; color: string; w: number; h: number; round: boolean }

const THEMES: Record<ThemeType, Record<string, BtnCfg>> = {
  xbox: {
    A:     { label: 'A',  color: '#22c55e', w: 56, h: 56, round: true  },
    B:     { label: 'B',  color: '#ef4444', w: 56, h: 56, round: true  },
    X:     { label: 'X',  color: '#3b82f6', w: 56, h: 56, round: true  },
    Y:     { label: 'Y',  color: '#eab308', w: 56, h: 56, round: true  },
    LB:    { label: 'LB', color: '#64748b', w: 80, h: 36, round: false },
    RB:    { label: 'RB', color: '#64748b', w: 80, h: 36, round: false },
    LT:    { label: 'LT', color: '#64748b', w: 80, h: 36, round: false },
    RT:    { label: 'RT', color: '#64748b', w: 80, h: 36, round: false },
    Up:    { label: '▲',  color: '#475569', w: 44, h: 44, round: false },
    Down:  { label: '▼',  color: '#475569', w: 44, h: 44, round: false },
    Left:  { label: '◀',  color: '#475569', w: 44, h: 44, round: false },
    Right: { label: '▶',  color: '#475569', w: 44, h: 44, round: false },
    Start: { label: '≡',  color: '#475569', w: 40, h: 28, round: false },
    Back:  { label: '⊞',  color: '#475569', w: 40, h: 28, round: false },
    Xbox:  { label: 'X',  color: '#16a34a', w: 38, h: 38, round: true  },
    LS:    { label: 'LS', color: '#334155', w: 34, h: 34, round: true  },
    RS:    { label: 'RS', color: '#334155', w: 34, h: 34, round: true  },
  },
  ps: {
    A:     { label: '✖',  color: '#3b82f6', w: 56, h: 56, round: true  },
    B:     { label: '◯',  color: '#ef4444', w: 56, h: 56, round: true  },
    X:     { label: '◻',  color: '#d946ef', w: 56, h: 56, round: true  },
    Y:     { label: '△',  color: '#22c55e', w: 56, h: 56, round: true  },
    LB:    { label: 'L1', color: '#64748b', w: 80, h: 36, round: false },
    RB:    { label: 'R1', color: '#64748b', w: 80, h: 36, round: false },
    LT:    { label: 'L2', color: '#64748b', w: 80, h: 36, round: false },
    RT:    { label: 'R2', color: '#64748b', w: 80, h: 36, round: false },
    Up:    { label: '▲',  color: '#475569', w: 44, h: 44, round: false },
    Down:  { label: '▼',  color: '#475569', w: 44, h: 44, round: false },
    Left:  { label: '◀',  color: '#475569', w: 44, h: 44, round: false },
    Right: { label: '▶',  color: '#475569', w: 44, h: 44, round: false },
    Start: { label: 'Opt',color: '#475569', w: 40, h: 28, round: false },
    Back:  { label: 'Shr',color: '#475569', w: 40, h: 28, round: false },
    Xbox:  { label: 'PS', color: '#3b82f6', w: 38, h: 38, round: true  },
    LS:    { label: 'L3', color: '#334155', w: 34, h: 34, round: true  },
    RS:    { label: 'R3', color: '#334155', w: 34, h: 34, round: true  },
  },
  nintendo: {
    A:     { label: 'B',  color: '#eab308', w: 56, h: 56, round: true  },
    B:     { label: 'A',  color: '#ef4444', w: 56, h: 56, round: true  },
    X:     { label: 'Y',  color: '#22c55e', w: 56, h: 56, round: true  },
    Y:     { label: 'X',  color: '#3b82f6', w: 56, h: 56, round: true  },
    LB:    { label: 'L',  color: '#64748b', w: 80, h: 36, round: false },
    RB:    { label: 'R',  color: '#64748b', w: 80, h: 36, round: false },
    LT:    { label: 'ZL', color: '#64748b', w: 80, h: 36, round: false },
    RT:    { label: 'ZR', color: '#64748b', w: 80, h: 36, round: false },
    Up:    { label: '▲',  color: '#475569', w: 44, h: 44, round: false },
    Down:  { label: '▼',  color: '#475569', w: 44, h: 44, round: false },
    Left:  { label: '◀',  color: '#475569', w: 44, h: 44, round: false },
    Right: { label: '▶',  color: '#475569', w: 44, h: 44, round: false },
    Start: { label: '+',  color: '#475569', w: 32, h: 32, round: true  },
    Back:  { label: '-',  color: '#475569', w: 32, h: 32, round: true  },
    Xbox:  { label: '⌂',  color: '#ef4444', w: 38, h: 38, round: true  },
    LS:    { label: 'LS', color: '#334155', w: 34, h: 34, round: true  },
    RS:    { label: 'RS', color: '#334155', w: 34, h: 34, round: true  },
  }
};

const BTN_IDS = Object.keys(THEMES.xbox);
const STICK_IDS = ['LeftStick', 'RightStick'] as const;

const DEFAULT_LAYOUT: GamepadLayout = {
  version: 2,
  controls: {
    LT: { x: 3, y: 3 }, LB: { x: 16, y: 3 },
    RB: { x: 74, y: 3 }, RT: { x: 87, y: 3 },
    Back: { x: 40, y: 8 }, Xbox: { x: 48, y: 3 }, Start: { x: 55, y: 8 },
    Up: { x: 20, y: 22 }, Down: { x: 20, y: 50 },
    Left: { x: 11, y: 36 }, Right: { x: 29, y: 36 },
    Y: { x: 81, y: 18 }, X: { x: 72, y: 34 },
    B: { x: 90, y: 34 }, A: { x: 81, y: 50 },
    LeftStick: { x: 12, y: 68 }, RightStick: { x: 76, y: 68 },
    LS: { x: 4, y: 90 }, RS: { x: 91, y: 90 },
  }
};

/* ═══════════════════ Helpers ═══════════════════ */
function loadLayout(theme: ThemeType, profileId: string): GamepadLayout {
  try {
    let raw = localStorage.getItem(`${LAYOUT_KEY}_${profileId}_${theme}`);
    // Migration from old unprofiled layout
    if (!raw && profileId === 'default') {
      raw = localStorage.getItem(`${LAYOUT_KEY}_${theme}`);
      if (raw) {
        localStorage.setItem(`${LAYOUT_KEY}_${profileId}_${theme}`, raw);
      }
    }
    if (raw) { const p = JSON.parse(raw); if (p.controls) return p; }
  } catch { /* ignore */ }
  return DEFAULT_LAYOUT;
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

/* ═══════════════════ GpButton ═══════════════════ */
const GpButton: React.FC<{
  id: string; cfg: BtnCfg; pos: Pos;
  editMode: boolean; active: boolean; isSelected: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onDrag: (x: number, y: number) => void;
  onPress: () => void; onRelease: () => void;
  onSelect: () => void;
}> = ({ id, cfg, pos, editMode, active, isSelected, canvasRef, onDrag, onPress, onRelease, onSelect }) => {
  const dragRef = useRef<{ tid: number; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const onDragRef = useRef(onDrag); onDragRef.current = onDrag;
  const onSelectRef = useRef(onSelect); onSelectRef.current = onSelect;

  const effectiveW = pos.w ?? cfg.w;
  const effectiveH = pos.h ?? cfg.h;
  const effectiveRound = pos.round ?? cfg.round;

  useEffect(() => {
    const move = (e: TouchEvent) => {
      const d = dragRef.current; if (!d) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier !== d.tid) continue;
        e.preventDefault();
        if (Math.abs(t.clientX - d.sx) > 5 || Math.abs(t.clientY - d.sy) > 5) d.moved = true;
        const c = canvasRef.current; if (!c) return;
        const r = c.getBoundingClientRect();
        onDragRef.current(
          clamp(d.ox + ((t.clientX - d.sx) / r.width) * 100, 0, 95),
          clamp(d.oy + ((t.clientY - d.sy) / r.height) * 100, 0, 95)
        );
      }
    };
    const end = (e: TouchEvent) => {
      const d = dragRef.current; if (!d) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === d.tid) {
          if (!d.moved) onSelectRef.current();
          dragRef.current = null;
        }
      }
    };
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', end);
    return () => { document.removeEventListener('touchmove', move); document.removeEventListener('touchend', end); };
  }, [canvasRef]);

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (editMode) {
      const t = e.changedTouches[0];
      dragRef.current = { tid: t.identifier, sx: t.clientX, sy: t.clientY, ox: pos.x, oy: pos.y, moved: false };
    } else {
      onPress();
      if (navigator.vibrate) navigator.vibrate(12);
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!editMode) onRelease();
  };

  // Mouse support for desktop testing
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editMode) {
      const sx = e.clientX, sy = e.clientY, ox = pos.x, oy = pos.y;
      let moved = false;
      const mm = (me: MouseEvent) => {
        if (Math.abs(me.clientX - sx) > 5 || Math.abs(me.clientY - sy) > 5) moved = true;
        const c = canvasRef.current; if (!c) return;
        const r = c.getBoundingClientRect();
        onDragRef.current(
          clamp(ox + ((me.clientX - sx) / r.width) * 100, 0, 95),
          clamp(oy + ((me.clientY - sy) / r.height) * 100, 0, 95)
        );
      };
      const mu = () => {
        if (!moved) onSelectRef.current();
        document.removeEventListener('mousemove', mm);
        document.removeEventListener('mouseup', mu);
      };
      document.addEventListener('mousemove', mm);
      document.addEventListener('mouseup', mu);
    } else { onPress(); }
  };
  const onMouseUp = () => { if (!editMode) onRelease(); };
  const onMouseLeave = () => { if (!editMode && active) onRelease(); };

  return (
    <div
      className={`gp-ctrl ${editMode ? 'edit' : ''} ${isSelected ? 'selected' : ''}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
      onContextMenu={e => e.preventDefault()}
    >
      <div
        className={`gp-btn ${active ? 'active' : ''} ${effectiveRound ? 'round' : 'rect'}`}
        style={{
          width: effectiveW, height: effectiveH,
          borderColor: cfg.color,
          ...(active ? { backgroundColor: cfg.color, color: '#000' } : {}),
        }}
      >
        {cfg.label}
      </div>
      {editMode && <span className="gp-ctrl-label">{id}</span>}
    </div>
  );
};

/* ═══════════════════ GpJoystick ═══════════════════ */
const GpJoystick: React.FC<{
  id: string; pos: Pos; editMode: boolean; isSelected: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onDrag: (x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onSelect: () => void;
}> = ({ id, pos, editMode, isSelected, canvasRef, onDrag, onMove, onSelect }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const stickTouch = useRef<number | null>(null);
  const dragTouch = useRef<{ tid: number; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  const onMoveRef = useRef(onMove); onMoveRef.current = onMove;
  const onDragRef = useRef(onDrag); onDragRef.current = onDrag;
  const editRef = useRef(editMode); editRef.current = editMode;
  const onSelectRef = useRef(onSelect); onSelectRef.current = onSelect;

  const joySize = pos.w ?? 120;
  const knobSize = Math.round(joySize * 0.4);

  const calcStick = useCallback((cx: number, cy: number) => {
    const el = elRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const midX = r.left + r.width / 2, midY = r.top + r.height / 2;
    const maxR = r.width * 0.3;
    let dx = cx - midX, dy = cy - midY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
    setKnob({ x: dx, y: dy });
    const nx = dx / maxR, ny = -dy / maxR; // invert Y
    const sx = Math.round(clamp(nx * 32767, -32768, 32767));
    const sy = Math.round(clamp(ny * 32767, -32768, 32767));
    onMoveRef.current(sx, sy);
  }, []);

  useEffect(() => {
    const move = (e: TouchEvent) => {
      // Edit drag
      const d = dragTouch.current;
      if (d) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier !== d.tid) continue;
          e.preventDefault();
          if (Math.abs(t.clientX - d.sx) > 5 || Math.abs(t.clientY - d.sy) > 5) d.moved = true;
          const c = canvasRef.current; if (!c) return;
          const cr = c.getBoundingClientRect();
          onDragRef.current(
            clamp(d.ox + ((t.clientX - d.sx) / cr.width) * 100, 0, 85),
            clamp(d.oy + ((t.clientY - d.sy) / cr.height) * 100, 0, 70)
          );
        }
        return;
      }
      // Play stick
      if (stickTouch.current !== null) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === stickTouch.current) { e.preventDefault(); calcStick(t.clientX, t.clientY); }
        }
      }
    };
    const end = (e: TouchEvent) => {
      const dt = dragTouch.current;
      if (dt) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === dt.tid) {
            if (!dt.moved) onSelectRef.current();
            dragTouch.current = null;
          }
        }
        return;
      }
      if (stickTouch.current !== null) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === stickTouch.current) {
            stickTouch.current = null;
            setKnob({ x: 0, y: 0 });
            onMoveRef.current(0, 0);
          }
        }
      }
    };
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', end);
    return () => { document.removeEventListener('touchmove', move); document.removeEventListener('touchend', end); };
  }, [canvasRef, calcStick]);

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); e.stopPropagation();
    const t = e.changedTouches[0];
    if (editRef.current) {
      dragTouch.current = { tid: t.identifier, sx: t.clientX, sy: t.clientY, ox: pos.x, oy: pos.y, moved: false };
    } else {
      stickTouch.current = t.identifier;
      calcStick(t.clientX, t.clientY);
    }
  };

  // Mouse support for desktop
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editMode) {
      const sx = e.clientX, sy = e.clientY, ox = pos.x, oy = pos.y;
      let moved = false;
      const mm = (me: MouseEvent) => {
        if (Math.abs(me.clientX - sx) > 5 || Math.abs(me.clientY - sy) > 5) moved = true;
        const c = canvasRef.current; if (!c) return;
        const cr = c.getBoundingClientRect();
        onDragRef.current(
          clamp(ox + ((me.clientX - sx) / cr.width) * 100, 0, 85),
          clamp(oy + ((me.clientY - sy) / cr.height) * 100, 0, 70)
        );
      };
      const mu = () => {
        if (!moved) onSelectRef.current();
        document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu);
      };
      document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
    } else {
      calcStick(e.clientX, e.clientY);
      const mm = (me: MouseEvent) => calcStick(me.clientX, me.clientY);
      const mu = () => {
        setKnob({ x: 0, y: 0 }); onMoveRef.current(0, 0);
        document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu);
      };
      document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
    }
  };

  return (
    <div
      className={`gp-ctrl ${editMode ? 'edit' : ''} ${isSelected ? 'selected' : ''}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <div
        ref={elRef}
        className="gp-joy"
        style={{ width: joySize, height: joySize }}
        onTouchStart={onTouchStart}
        onMouseDown={onMouseDown}
        onContextMenu={e => e.preventDefault()}
      >
        <div className="gp-joy-knob" style={{
          width: knobSize, height: knobSize,
          transform: `translate(${knob.x}px, ${knob.y}px)`
        }} />
        <div className="gp-joy-cross-h" /><div className="gp-joy-cross-v" />
      </div>
      {editMode && <span className="gp-ctrl-label">{id}</span>}
    </div>
  );
};

/* ═══════════════════ Main Component ═══════════════════ */
export const VirtualGamepad: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState<string>(() => localStorage.getItem('gamepad_active_profile') || 'default');
  const [profiles, setProfiles] = useState<{id: string, name: string}[]>(() => {
    try {
      const p = localStorage.getItem('gamepad_profiles');
      if (p) return JSON.parse(p);
    } catch {}
    return [{ id: 'default', name: 'الافتراضي' }];
  });

  const [theme, setTheme] = useState<ThemeType>(() => (localStorage.getItem('gamepad_theme') as ThemeType) || 'xbox');
  const [layout, setLayout] = useState<GamepadLayout>(() => {
    const initialTheme = (localStorage.getItem('gamepad_theme') as ThemeType) || 'xbox';
    const initialProfile = localStorage.getItem('gamepad_active_profile') || 'default';
    return loadLayout(initialTheme, initialProfile);
  });
  const [editMode, setEditMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [serverUrl, setServerUrl] = useState(() => localStorage.getItem(URL_KEY) || `http://${window.location.hostname}:5000`);
  const [controllerType, setControllerType] = useState<number>(() => parseInt(localStorage.getItem('gamepad_ctype') || '0', 10));
  const [enableVib, setEnableVib] = useState<boolean>(() => localStorage.getItem('gamepad_vib') !== 'false');
  const [sensitivity, setSensitivity] = useState<number>(() => parseInt(localStorage.getItem('gamepad_sens') || '100', 10));
  const [connStatus, setConnStatus] = useState<'off' | 'ing' | 'on'>('off');
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBarHidden, setIsBarHidden] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [selectedControl, setSelectedControl] = useState<string | null>(null);
  const [visibilityMenuOpen, setVisibilityMenuOpen] = useState(false);

  const connRef = useRef<signalR.HubConnection | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear selection when exiting edit mode
  useEffect(() => { 
    if (!editMode) {
      setSelectedControl(null);
      setVisibilityMenuOpen(false);
    }
  }, [editMode]);

  // Fullscreen support
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) setIsBarHidden(false);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  // Persist
  useEffect(() => { localStorage.setItem(`${LAYOUT_KEY}_${activeProfile}_${theme}`, JSON.stringify(layout)); }, [layout, theme, activeProfile]);
  useEffect(() => { localStorage.setItem('gamepad_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('gamepad_active_profile', activeProfile); }, [activeProfile]);
  useEffect(() => { localStorage.setItem('gamepad_profiles', JSON.stringify(profiles)); }, [profiles]);

  const switchProfile = useCallback((profileId: string) => {
    setActiveProfile(profileId);
    setLayout(loadLayout(theme, profileId));
  }, [theme]);

  const createNewProfile = () => {
    const name = prompt('أدخل اسم البروفايل الجديد:');
    if (name && name.trim()) {
      const newId = 'p_' + Date.now();
      setProfiles(prev => [...prev, { id: newId, name: name.trim() }]);
      setActiveProfile(newId);
      setLayout(loadLayout(theme, newId));
    }
  };

  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return alert('لا يمكن حذف البروفايل الوحيد');
    if (window.confirm('هل أنت متأكد من حذف هذا البروفايل؟')) {
      const newProfiles = profiles.filter(p => p.id !== profileId);
      setProfiles(newProfiles);
      if (activeProfile === profileId) {
        const fallback = newProfiles[0].id;
        setActiveProfile(fallback);
        setLayout(loadLayout(theme, fallback));
      }
      Object.keys(THEMES).forEach(t => localStorage.removeItem(`${LAYOUT_KEY}_${profileId}_${t}`));
    }
  };
  useEffect(() => { localStorage.setItem(URL_KEY, serverUrl); }, [serverUrl]);
  useEffect(() => { localStorage.setItem('gamepad_ctype', controllerType.toString()); }, [controllerType]);
  useEffect(() => { localStorage.setItem('gamepad_vib', enableVib.toString()); }, [enableVib]);
  useEffect(() => { localStorage.setItem('gamepad_sens', sensitivity.toString()); }, [sensitivity]);

  // Live updates
  const updateLiveSetting = useCallback((key: string, val: string) => {
    if (connStatus === 'on' && connRef.current?.state === signalR.HubConnectionState.Connected) {
      connRef.current.invoke('UpdateSetting', key, val).catch(console.error);
    }
  }, [connStatus]);

  useEffect(() => { updateLiveSetting('ControllerType', controllerType.toString()); }, [controllerType, updateLiveSetting]);
  useEffect(() => { updateLiveSetting('EnableVib', enableVib.toString()); }, [enableVib, updateLiveSetting]);
  useEffect(() => { updateLiveSetting('Sensitivity', sensitivity.toString()); }, [sensitivity, updateLiveSetting]);

  useEffect(() => { return () => {
    if (pingRef.current) clearInterval(pingRef.current);
    dcRef.current?.close(); pcRef.current?.close(); connRef.current?.stop();
  }; }, []);

  // Connection (SignalR = signaling only, WebRTC Data Channel = gamepad data)
  const connect = async () => {
    // Cleanup previous connections
    if (pingRef.current) { clearInterval(pingRef.current); pingRef.current = null; }
    if (dcRef.current) { dcRef.current.close(); dcRef.current = null; }
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    if (connRef.current) { await connRef.current.stop(); connRef.current = null; }
    setConnStatus('ing');
    setLatency(null);

    let url = serverUrl.trim().replace(/\/$/, '');
    if (!url.endsWith('/gamepadhub')) url += '/gamepadhub';

    // 1. SignalR — signaling only (no auto-reconnect needed)
    const c = new signalR.HubConnectionBuilder()
      .withUrl(url, { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
      .build();
    c.onclose(() => {
      // If data channel isn't open yet, mark as disconnected
      if (dcRef.current?.readyState !== 'open') setConnStatus('off');
    });

    // 2. WebRTC peer connection (LAN — no STUN/TURN needed)
    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    // 3. Create Data Channel (unreliable + unordered = lowest latency)
    const dc = pc.createDataChannel('gamepad', { ordered: false, maxRetransmits: 0 });
    dcRef.current = dc;

    dc.onopen = () => {
      console.log('[WebRTC] Data Channel opened — ready to send gamepad data!');
      setConnStatus('on');
      // Start latency ping every 2 seconds
      pingRef.current = setInterval(() => {
        if (dcRef.current?.readyState === 'open') {
          dcRef.current.send(`Ping:${Date.now()}`);
        }
      }, 2000);
    };
    dc.onclose = () => {
      console.log('[WebRTC] Data Channel closed');
      if (pingRef.current) { clearInterval(pingRef.current); pingRef.current = null; }
      setLatency(null);
      setConnStatus('off');
    };
    dc.onmessage = (event) => {
      const msg = typeof event.data === 'string' ? event.data : '';
      if (msg.startsWith('Pong:')) {
        const sent = parseInt(msg.substring(5), 10);
        if (!isNaN(sent)) setLatency(Date.now() - sent);
      } else {
        const parts = msg.split(':');
        if (parts[0] === 'V') {
          const intensity = parseInt(parts[1], 10);
          if (intensity > 0) {
            if (navigator.vibrate) navigator.vibrate(100);
          } else {
            if (navigator.vibrate) navigator.vibrate(0);
          }
        }
      }
    };

    // 4. Send our ICE candidates to server via SignalR
    pc.onicecandidate = (event) => {
      if (event.candidate && connRef.current?.state === signalR.HubConnectionState.Connected) {
        connRef.current.invoke('SendIceCandidate', JSON.stringify(event.candidate.toJSON())).catch(console.error);
      }
    };

    // 5. Listen for server's answer & ICE candidates
    c.on('ReceiveAnswer', async (sdpAnswer: string) => {
      try { await pc.setRemoteDescription({ type: 'answer', sdp: sdpAnswer }); }
      catch (err) { console.error('[WebRTC] Failed to set remote description:', err); }
    });
    c.on('ReceiveIceCandidate', async (iceCandidateJson: string) => {
      try { await pc.addIceCandidate(JSON.parse(iceCandidateJson)); }
      catch (err) { console.error('[WebRTC] Failed to add ICE candidate:', err); }
    });

    try {
      // 6. Start SignalR, then create & send SDP offer
      await c.start();
      connRef.current = c;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await c.invoke('SendOffer', offer.sdp, controllerType, enableVib, sensitivity);
    } catch (err) {
      console.error(err);
      pc.close(); pcRef.current = null;
      dc.close(); dcRef.current = null;
      setConnStatus('off');
      alert('فشل الاتصال: ' + err);
    }
  };

  const disconnect = async () => {
    if (pingRef.current) { clearInterval(pingRef.current); pingRef.current = null; }
    setLatency(null);
    if (dcRef.current) { dcRef.current.close(); dcRef.current = null; }
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    await connRef.current?.stop(); connRef.current = null;
    setConnStatus('off');
  };

  // Data Channel sends — ultra-low-latency gamepad input
  const sendButton = useCallback((btn: string, pressed: boolean) => {
    const dc = dcRef.current;
    if (dc?.readyState === 'open') {
      dc.send(`B:${btn}:${pressed ? '1' : '0'}`);
    }
  }, []);

  const sendJoystick = useCallback((stick: string, x: number, y: number) => {
    const dc = dcRef.current;
    if (dc?.readyState === 'open') {
      dc.send(`J:${stick}:${x}:${y}`);
    }
  }, []);

  // Layout ops
  const updatePos = useCallback((id: string, x: number, y: number) => {
    setLayout(prev => ({ ...prev, controls: { ...prev.controls, [id]: { ...prev.controls[id], x, y } } }));
  }, []);

  const updateSize = useCallback((id: string, delta: number) => {
    setLayout(prev => {
      const ctrl = prev.controls[id] || { x: 50, y: 50 };
      const isStick = (STICK_IDS as readonly string[]).includes(id);
      const defaultW = isStick ? 120 : (THEMES[theme][id]?.w ?? 56);
      const defaultH = isStick ? 120 : (THEMES[theme][id]?.h ?? 56);
      const curW = ctrl.w ?? defaultW;
      const curH = ctrl.h ?? defaultH;
      return { ...prev, controls: { ...prev.controls, [id]: { ...ctrl, w: clamp(curW + delta, 24, 200), h: clamp(curH + delta, 24, 200) } } };
    });
  }, [theme]);

  const setSize = useCallback((id: string, size: number) => {
    setLayout(prev => {
      const ctrl = prev.controls[id] || { x: 50, y: 50 };
      return { ...prev, controls: { ...prev.controls, [id]: { ...ctrl, w: clamp(size, 24, 200), h: clamp(size, 24, 200) } } };
    });
  }, []);


  const setShape = useCallback((id: string, round: boolean) => {
    setLayout(prev => {
      const ctrl = prev.controls[id] || { x: 50, y: 50 };
      return { ...prev, controls: { ...prev.controls, [id]: { ...ctrl, round } } };
    });
  }, []);

  const nudgePos = useCallback((id: string, dx: number, dy: number) => {
    setLayout(prev => {
      const ctrl = prev.controls[id] || { x: 50, y: 50 };
      return {
        ...prev,
        controls: {
          ...prev.controls,
          [id]: {
            ...ctrl,
            x: clamp(ctrl.x + dx, 0, 95),
            y: clamp(ctrl.y + dy, 0, 95)
          }
        }
      };
    });
  }, []);

  const resetControl = useCallback((id: string) => {
    setLayout(prev => {
      const newControls = { ...prev.controls };
      const defaultPos = DEFAULT_LAYOUT.controls[id];
      if (defaultPos) {
        newControls[id] = { ...defaultPos };
      } else {
        delete newControls[id];
      }
      return { ...prev, controls: newControls };
    });
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setLayout(prev => {
      const defaultPos = DEFAULT_LAYOUT.controls[id];
      const ctrl = prev.controls[id] || (defaultPos ? { ...defaultPos } : { x: 50, y: 50 });
      return { ...prev, controls: { ...prev.controls, [id]: { ...ctrl, hidden: !ctrl.hidden } } };
    });
    setSelectedControl(prev => prev === id ? null : prev);
  }, []);

  const resetLayout = () => { setLayout(DEFAULT_LAYOUT); setMenuOpen(false); setSelectedControl(null); setVisibilityMenuOpen(false); };

  const exportLayout = () => {
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'gamepad-layout.json'; a.click(); URL.revokeObjectURL(a.href);
    setMenuOpen(false);
  };

  const importLayout = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = JSON.parse(reader.result as string);
        if (p.controls) { setLayout(p); } else { alert('ملف غير صالح'); }
      } catch { alert('فشل قراءة الملف'); }
    };
    reader.readAsText(file);
    e.target.value = '';
    setMenuOpen(false);
  };

  // Helpers for edit toolbar display
  const getSelectedSize = () => {
    if (!selectedControl) return 0;
    const ctrl = layout.controls[selectedControl];
    const isStick = (STICK_IDS as readonly string[]).includes(selectedControl);
    const defaultW = isStick ? 120 : (THEMES[theme][selectedControl]?.w ?? 56);
    return ctrl?.w ?? defaultW;
  };

  const getSelectedRound = () => {
    if (!selectedControl || !THEMES[theme][selectedControl]) return false;
    const ctrl = layout.controls[selectedControl];
    return ctrl?.round ?? THEMES[theme][selectedControl]?.round ?? true;
  };

  return (
    <div className="gp-root">
      {/* ─── Top Bar ─── */}
      <div className={`gp-bar ${isBarHidden ? 'hidden' : ''}`}>
        <div className={`gp-dot ${connStatus}`} onClick={() => setSettingsOpen(true)} />
        <span className="gp-bar-status" onClick={() => setSettingsOpen(true)}>
          {connStatus === 'on' ? 'متصل' : connStatus === 'ing' ? 'جاري...' : 'غير متصل'}
        </span>
        {connStatus === 'on' && latency !== null && (
          <span className={`gp-latency ${latency < 20 ? 'good' : latency < 50 ? 'ok' : 'bad'}`}>
            {latency}ms
          </span>
        )}
        <div className="gp-spacer" />
        {isFullscreen && (
          <button className="gp-bar-btn" onClick={() => setIsBarHidden(true)}>
            👁️ إخفاء
          </button>
        )}
        <button
          className="gp-bar-btn"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? '🗗 تصغير' : '🗖 كاملة'}
        </button>
        <button
          className={`gp-bar-btn ${editMode ? 'done' : ''}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? '✓ تم' : '✏️ تعديل'}
        </button>
        {editMode && (
          <div className="gp-menu-wrap">
            <button className="gp-bar-btn" onClick={() => { setVisibilityMenuOpen(!visibilityMenuOpen); setMenuOpen(false); }}>
              👁️ الأزرار
            </button>
            {visibilityMenuOpen && (
              <div className="gp-dropdown" style={{ maxHeight: '60vh', overflowY: 'auto', minWidth: '150px' }}>
                {[...BTN_IDS, ...STICK_IDS].map(id => {
                  const isHidden = layout.controls[id]?.hidden === true;
                  return (
                    <button key={id} onClick={() => toggleVisibility(id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{id === 'LeftStick' ? 'عصا اليسار' : id === 'RightStick' ? 'عصا اليمين' : id}</span>
                      <span>{isHidden ? '🚫' : '✅'}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className="gp-menu-wrap">
          <button className="gp-bar-btn" onClick={() => { setMenuOpen(!menuOpen); setVisibilityMenuOpen(false); }}>☰</button>
          {menuOpen && (
            <div className="gp-dropdown">
              <button onClick={resetLayout}>🔄 إعادة ضبط</button>
              <button onClick={exportLayout}>📤 تصدير</button>
              <button onClick={() => { fileRef.current?.click(); }}>📥 استيراد</button>
              <button onClick={() => { setSettingsOpen(true); setMenuOpen(false); }}>⚙️ اتصال</button>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importLayout} />
      </div>

      {/* ─── Show Bar Button (when hidden) ─── */}
      {isBarHidden && (
        <button 
          className="gp-show-bar-btn"
          onClick={() => setIsBarHidden(false)}
        >
          👁️
        </button>
      )}

      {/* ─── Settings Modal ─── */}
      {settingsOpen && (
        <div className="gp-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="gp-modal" onClick={e => e.stopPropagation()}>
            <h3>الإعدادات</h3>
            
            <label>البروفايل (تخصيص الأزرار)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <select 
                className="gp-input" 
                value={activeProfile}
                onChange={e => switchProfile(e.target.value)}
                style={{ flex: 1, marginBottom: 0 }}
              >
                {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="gp-mbtn green" style={{ padding: '0 12px', flex: 'none' }} onClick={createNewProfile}>+</button>
              <button className="gp-mbtn red" style={{ padding: '0 12px', flex: 'none' }} onClick={() => deleteProfile(activeProfile)} disabled={profiles.length <= 1}>-</button>
            </div>

            <label>شكل الأزرار (التصميم)</label>
            <select 
              className="gp-input" 
              value={theme}
              onChange={e => {
                const newTheme = e.target.value as ThemeType;
                setTheme(newTheme);
                setLayout(loadLayout(newTheme, activeProfile));
              }}
              style={{ marginBottom: '16px' }}
            >
              <option value="xbox">Xbox (الافتراضي)</option>
              <option value="ps">PlayStation</option>
              <option value="nintendo">Nintendo Switch</option>
            </select>

            <label>نوع اليد (التي تظهر في النظام)</label>
            <select 
              className="gp-input" 
              value={controllerType}
              onChange={e => setControllerType(parseInt(e.target.value, 10))}
              style={{ marginBottom: '16px' }}
              disabled={connStatus === 'on' || connStatus === 'ing'}
            >
              <option value={0}>Xbox 360</option>
              <option value={1}>DualShock 4 (PS4)</option>
            </select>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={enableVib}
                onChange={e => setEnableVib(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              تفعيل الاهتزاز
            </label>

            <label>حساسية الأزرار/العصا ({sensitivity}%)</label>
            <input 
              type="range" 
              className="gp-input" 
              min="10" max="200" 
              value={sensitivity}
              onChange={e => setSensitivity(parseInt(e.target.value, 10))}
              style={{ marginBottom: '16px' }}
            />

            <label>عنوان السيرفر</label>
            <input
              className="gp-input"
              value={serverUrl}
              onChange={e => setServerUrl(e.target.value)}
              placeholder="http://192.168.1.x:5000"
            />
            <div className="gp-modal-btns">
              {connStatus === 'on' ? (
                <button className="gp-mbtn red" onClick={disconnect}>قطع الاتصال</button>
              ) : (
                <button className="gp-mbtn green" onClick={connect} disabled={connStatus === 'ing'}>
                  {connStatus === 'ing' ? '...' : 'اتصال'}
                </button>
              )}
              <button className="gp-mbtn" onClick={() => setSettingsOpen(false)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Canvas ─── */}
      <div
        ref={canvasRef}
        className={`gp-canvas ${editMode ? 'editing' : ''} ${connStatus === 'off' ? 'dimmed' : ''}`}
        onClick={() => {
          if (menuOpen) setMenuOpen(false);
          if (visibilityMenuOpen) setVisibilityMenuOpen(false);
        }}
      >
        {BTN_IDS.map(id => {
          const pos = layout.controls[id] || DEFAULT_LAYOUT.controls[id] || { x: 50, y: 50 };
          if (pos.hidden) return null;
          return (
            <GpButton
              key={id} id={id} cfg={THEMES[theme][id]}
              pos={pos}
              editMode={editMode}
              active={activeButtons.has(id)}
              isSelected={selectedControl === id}
            canvasRef={canvasRef}
            onDrag={(x, y) => updatePos(id, x, y)}
            onPress={() => {
              if (editMode) return;
              setActiveButtons(p => new Set(p).add(id));
              sendButton(id, true);
            }}
            onRelease={() => {
              if (editMode) return;
              setActiveButtons(p => { const s = new Set(p); s.delete(id); return s; });
              sendButton(id, false);
            }}
            onSelect={() => setSelectedControl(id)}
            />
          );
        })}
        {STICK_IDS.map(sid => {
          const pos = layout.controls[sid] || DEFAULT_LAYOUT.controls[sid] || { x: 50, y: 50 };
          if (pos.hidden) return null;
          return (
            <GpJoystick
              key={sid} id={sid}
              pos={pos}
              editMode={editMode}
              isSelected={selectedControl === sid}
              canvasRef={canvasRef}
              onDrag={(x, y) => updatePos(sid, x, y)}
              onMove={(x, y) => { if (!editMode) sendJoystick(sid.replace('Stick', ''), x, y); }}
              onSelect={() => setSelectedControl(sid)}
            />
          );
        })}

        {/* ─── Edit Bar ─── */}
        {editMode && (
          <div className="gp-edit-bar">
            {selectedControl ? (
              <div className="gp-edit-panel">
                <div className="gp-edit-header">
                  <span className="gp-edit-icon">
                    {(STICK_IDS as readonly string[]).includes(selectedControl) ? '🕹️' : '🔘'}
                  </span>
                  <span className="gp-edit-title">
                    {selectedControl === 'LeftStick' ? 'عصا التحكم اليسرى (LS)' : 
                     selectedControl === 'RightStick' ? 'عصا التحكم اليمنى (RS)' : 
                     `زر ${selectedControl}`}
                  </span>
                </div>

                <div className="gp-edit-body">
                  {/* Size Control Row */}
                  <div className="gp-edit-section">
                    <span className="gp-edit-label">الحجم</span>
                    <div className="gp-edit-slider-wrap">
                      <button className="gp-edit-btn-val" onClick={() => updateSize(selectedControl, -4)}>−</button>
                      <input 
                        type="range" 
                        min="24" 
                        max="200" 
                        value={getSelectedSize()} 
                        onChange={(e) => setSize(selectedControl, parseInt(e.target.value, 10))} 
                        className="gp-edit-slider"
                      />
                      <button className="gp-edit-btn-val" onClick={() => updateSize(selectedControl, 4)}>+</button>
                      <span className="gp-edit-value-badge">{getSelectedSize()}px</span>
                    </div>
                  </div>

                  {/* Shape Control Row (Only for buttons) */}
                  {THEMES[theme][selectedControl] && (
                    <div className="gp-edit-section">
                      <span className="gp-edit-label">الشكل</span>
                      <div className="gp-edit-segmented">
                        <button 
                          className={`gp-edit-seg-btn ${getSelectedRound() ? 'active' : ''}`}
                          onClick={() => setShape(selectedControl, true)}
                        >
                          ● دائري
                        </button>
                        <button 
                          className={`gp-edit-seg-btn ${!getSelectedRound() ? 'active' : ''}`}
                          onClick={() => setShape(selectedControl, false)}
                        >
                          ■ مستطيل
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fine Nudge Control Row */}
                  <div className="gp-edit-section">
                    <span className="gp-edit-label">الموقع</span>
                    <div className="gp-edit-nudge">
                      <button className="gp-nudge-btn up" onClick={() => nudgePos(selectedControl, 0, -1)}>▲</button>
                      <div className="gp-nudge-mid">
                        <button className="gp-nudge-btn left" onClick={() => nudgePos(selectedControl, -1, 0)}>◀</button>
                        <span className="gp-nudge-title">محاذاة</span>
                        <button className="gp-nudge-btn right" onClick={() => nudgePos(selectedControl, 1, 0)}>▶</button>
                      </div>
                      <button className="gp-nudge-btn down" onClick={() => nudgePos(selectedControl, 0, 1)}>▼</button>
                    </div>
                  </div>
                </div>

                <div className="gp-edit-actions">
                  <button className="gp-edit-action reset" onClick={() => resetControl(selectedControl)}>
                    🔄 إعادة تعيين الزر
                  </button>
                  <button className="gp-edit-action close" onClick={() => setSelectedControl(null)}>
                    ✕ إغلاق
                  </button>
                </div>
              </div>
            ) : (
              <div className="gp-edit-hint">
                <span className="gp-edit-hint-pulse"></span>
                <span className="gp-edit-hint-text">اختر أي زر بالضغط عليه لتغيير حجمه وشكله ومكانه بدقة</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
