import React from 'react';
import type { GamepadLayout } from './types';
import { BTN_IDS, STICK_IDS } from './constants';

interface TopBarProps {
  connStatus: 'off' | 'ing' | 'on';
  latency: number | null;
  controllerId: number | null;
  isBarHidden: boolean;
  setIsBarHidden: (hidden: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  visibilityMenuOpen: boolean;
  setVisibilityMenuOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  resetLayout: () => void;
  exportLayout: () => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  importLayout: (e: React.ChangeEvent<HTMLInputElement>) => void;
  layout: GamepadLayout;
  toggleVisibility: (id: string) => void;
  showHitboxes: boolean;
  setShowHitboxes: (show: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  connStatus, latency, controllerId, isBarHidden, setIsBarHidden, isFullscreen, toggleFullscreen,
  editMode, setEditMode, menuOpen, setMenuOpen, visibilityMenuOpen, setVisibilityMenuOpen,
  setSettingsOpen, resetLayout, exportLayout, fileRef, importLayout, layout, toggleVisibility,
  showHitboxes, setShowHitboxes
}) => {
  return (
    <>
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
        {connStatus === 'on' && controllerId !== null && (
          <span className="gp-bar-status" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
            P{controllerId + 1} ({controllerId})
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
          <button
            className={`gp-bar-btn ${showHitboxes ? 'done' : ''}`}
            onClick={() => setShowHitboxes(!showHitboxes)}
          >
            🔲 منطقة اللمس
          </button>
        )}
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

      {isBarHidden && (
        <button 
          className="gp-show-bar-btn"
          onClick={() => setIsBarHidden(false)}
        >
          👁️
        </button>
      )}
    </>
  );
};
