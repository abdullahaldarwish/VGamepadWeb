import type { ThemeType, GamepadLayout } from './types';
import { LAYOUT_KEY, DEFAULT_LAYOUT } from './constants';

export function loadLayout(theme: ThemeType, profileId: string): GamepadLayout {
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

export function clamp(v: number, min: number, max: number) { 
  return Math.max(min, Math.min(max, v)); 
}
