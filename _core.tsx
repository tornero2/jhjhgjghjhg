import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, SPRING_PHYSICAL, SPRING_SOFT, THEME, rgba} from '../theme';
import type {WhisperWord} from '../types';
import type {OverlayAccent} from './overlayTypes';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Моноширинный голос для данных и меток. */
export const MONO = "'SF Mono', ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace";

export const accentColor = (a: OverlayAccent = 'ochre'): string =>
  a === 'terracotta' ? THEME.color.terracotta : a === 'olive' ? THEME.color.olive : THEME.color.ochre;

/* ───────────────────── ВЕСОВЫЕ КЛАССЫ МАТЕРИАЛА ─────────────────────
   chip  — мелкая метка, лёгкое стекло, живёт у края
   panel — блок данных, среднее стекло, держит цифры и графики

   tone определяет, на чём лежит материал:
   dark  — поверх фотографии (по умолчанию: кадры документальные и яркие)
   light — поверх собственного светлого фона сцены (stat, newsprint) */

export type MaterialTier = 'chip' | 'panel';
export type MaterialTone = 'light' | 'dark';

const TIER: Record<MaterialTier, {blur: number; sat: number; radius: number; shadow: number; lift: number}> = {
  chip: {blur: 24, sat: 190, radius: 26, shadow: 0.1, lift: 14},
  panel: {blur: 34, sat: 170, radius: 30, shadow: 0.16, lift: 30},
};

/** Безопасные зоны: подпись кадра сверху, субтитры снизу. */
export const ZONE = {
  edge: 96,
  top: 150,
  bottom: 300,
} as const;

/** Цвета текста под тон материала. */
export const onGlass = (tone: MaterialTone = 'dark') =>
  tone === 'dark'
    ? {primary: '#f7f3ea', secondary: rgba('#f7f3ea', 0.62), hairline: rgba('#ffffff', 0.2)}
    : {primary: THEME.color.ink, secondary: THEME.color.graphite, hairline: rgba(THEME.color.ivory, 0.22)};

/* ───────────────────────── МАТЕРИАЛИЗАЦИЯ ─────────────────────
   Стекло не «проявляется», а приезжает как материал:
   blur, scale и opacity анимируются вместе. Уход зеркалит вход. */

export type Anchor = 'left' | 'right' | 'top' | 'bottom' | 'center';

export interface MaterializeOptions {
  delay?: number;
  duration?: number;
  /** Стартовый радиус размытия, px. */
  blur?: number;
  /** Стартовый масштаб. */
  scale?: number;
  /** Стартовое смещение вдоль оси появления, px. */
  shift?: number;
  /** Откуда приходит — туда же и уходит. */
  from?: Anchor;
  /** Сколько кадров занимает уход в конце сцены. */
  holdOut?: number;
}

export interface Materialized {
  /** 0..1, уже с учётом ухода. */
  p: number;
  /** Чистый вход без ухода — для вложенных задержек. */
  enter: number;
  style: React.CSSProperties;
}

const VEC: Record<Anchor, [number, number]> = {
  left: [-1, 0],
  right: [1, 0],
  top: [0, -1],
  bottom: [0, 1],
  center: [0, 0],
};

export const useMaterialize = (o: MaterializeOptions = {}): Materialized => {
  const {delay = 0, duration = 34, blur = 16, scale = 0.985, shift = 24, from = 'bottom', holdOut = 24} = o;
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: SPRING_SOFT,
    durationInFrames: duration,
  });

  const rawOut = interpolate(frame, [durationInFrames - holdOut, durationInFrames - 2], [0, 1], clamp);
  const out = EASE.inOut(rawOut);
  const p = enter * (1 - out);

  const [vx, vy] = VEC[from];
  const k = 1 - p;

  return {
    p,
    enter,
    style: {
      opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
      filter: `blur(${(k * blur).toFixed(2)}px)`,
      transform: `translate3d(${(vx * shift * k).toFixed(2)}px, ${(vy * shift * k).toFixed(2)}px, 0) scale(${interpolate(
        p,
        [0, 1],
        [scale, 1]
      ).toFixed(4)})`,
      willChange: 'transform, opacity, filter',
    },
  };
};

/** Пружина с лёгким перелётом — только там, где у движения есть инерция. */
export const useMomentum = (delay = 0, duration = 34): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: SPRING_PHYSICAL, durationInFrames: duration});
};

/* ────────────────────────── СТЕКЛО ────────────────────────── */

export const Glass: React.FC<{
  children: React.ReactNode;
  tier?: MaterialTier;
  tone?: MaterialTone;
  pad?: string | number;
  /** Прогресс появления — включает блик по стеклу. */
  p?: number;
  style?: React.CSSProperties;
}> = ({children, tier = 'chip', tone = 'dark', pad = '24px 30px', p = 1, style}) => {
  const t = TIER[tier];
  const dark = tone === 'dark';

  // Блик проезжает по стеклу один раз на входе — материал ловит свет
  const sweep = interpolate(p, [0, 1], [-30, 150], clamp);
  const sheen = interpolate(p, [0.15, 0.85], [dark ? 0.22 : 0.5, 0], clamp);

  return (
    <div
      style={{
        position: 'relative',
        padding: pad,
        borderRadius: t.radius,
        overflow: 'hidden',
        background: dark
          ? `linear-gradient(145deg, ${rgba(THEME.color.ink, 0.72)}, ${rgba(THEME.color.ink, 0.6)})`
          : rgba(THEME.color.slateRaised, 0.7),
        backdropFilter: `blur(${t.blur}px) saturate(${t.sat}%)${dark ? ' brightness(0.82)' : ''}`,
        WebkitBackdropFilter: `blur(${t.blur}px) saturate(${t.sat}%)`,
        boxShadow: dark
          ? `inset 0 1px 0 ${rgba('#ffffff', 0.16)},
             inset 0 0 0 1px ${rgba('#ffffff', 0.08)},
             0 ${t.lift}px ${t.lift * 3}px ${rgba(THEME.color.ink, 0.42)}`
          : `inset 0 1px 0 ${rgba('#ffffff', 0.7)},
             inset 0 0 0 1px ${rgba(THEME.color.ivory, 0.06)},
             0 ${t.lift}px ${t.lift * 3}px ${rgba(THEME.color.ink, t.shadow)}`,
        ...style,
      }}
    >
      {sheen > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(105deg, transparent ${sweep - 22}%, ${rgba(
              '#ffffff',
              sheen
            )} ${sweep}%, transparent ${sweep + 22}%)`,
          }}
        />
      ) : null}
      {children}
    </div>
  );
};

/* ───────────────────────── SCRIM ─────────────────────
   Кадр не перекрывается карточкой — он уходит назад целиком:
   backdrop-filter по всему полю плюс вуаль, плотнее со стороны текста. */

export const Scrim: React.FC<{
  side?: 'left' | 'right';
  tone?: MaterialTone;
  delay?: number;
  duration?: number;
  blur?: number;
  /** Плотность вуали у края с текстом, 0..1. */
  veil?: number;
}> = ({side = 'left', tone = 'light', delay = 0, duration = 42, blur = 20, veil = 0.74}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame: frame - delay, fps, config: SPRING_SOFT, durationInFrames: duration});
  const out = EASE.inOut(interpolate(frame, [durationInFrames - 28, durationInFrames - 2], [0, 1], clamp));
  const p = enter * (1 - out);

  const dir = side === 'left' ? 'to right' : 'to left';
  const base = tone === 'dark' ? THEME.color.ink : THEME.color.slateRaised;
  const mid = tone === 'dark' ? THEME.color.ink : THEME.color.slate;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backdropFilter: `blur(${(blur * p).toFixed(2)}px) saturate(${(100 - 22 * p).toFixed(0)}%) brightness(${(
          tone === 'dark' ? 1 - 0.12 * p : 1 + 0.06 * p
        ).toFixed(3)})`,
        WebkitBackdropFilter: `blur(${(blur * p).toFixed(2)}px) saturate(${(100 - 22 * p).toFixed(0)}%)`,
        background: `linear-gradient(${dir},
          ${rgba(base, veil * p)} 0%,
          ${rgba(base, veil * p * 0.62)} 38%,
          ${rgba(mid, veil * p * 0.16)} 78%,
          transparent 100%)`,
        opacity: p,
      }}
    />
  );
};

/* ─────────────────────── БОКОВОЙ БЛЮР-УОШ ───────────────────────
   Полоса backdrop-filter с маской-градиентом: кадр мягко садится
   со стороны оверлея, текст остаётся читаемым, границы нет. */

export const EdgeWash: React.FC<{
  side?: Anchor;
  /** Ширина или высота полосы, px. */
  size?: number;
  blur?: number;
  delay?: number;
  duration?: number;
  /** Сила подложки, 0..1. */
  tint?: number;
  tone?: MaterialTone;
}> = ({side = 'left', size = 780, blur = 26, delay = 0, duration = 42, tint = 0.4, tone = 'dark'}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame: frame - delay, fps, config: SPRING_SOFT, durationInFrames: duration});
  const out = EASE.inOut(interpolate(frame, [durationInFrames - 26, durationInFrames - 2], [0, 1], clamp));
  const p = enter * (1 - out);

  if (side === 'center') return null;

  const horizontal = side === 'left' || side === 'right';
  const flip = side === 'right' || side === 'bottom';
  const axis = horizontal ? 'to right' : 'to bottom';
  const base = tone === 'dark' ? THEME.color.ink : THEME.color.slateRaised;

  const maskStops = flip
    ? 'rgba(0,0,0,0) 0%, rgba(0,0,0,0.34) 46%, rgba(0,0,0,1) 100%'
    : 'rgba(0,0,0,1) 0%, rgba(0,0,0,0.34) 54%, rgba(0,0,0,0) 100%';
  const mask = `linear-gradient(${axis}, ${maskStops})`;

  const tintStops = flip
    ? `${rgba(base, 0)} 0%, ${rgba(base, tint)} 100%`
    : `${rgba(base, tint)} 0%, ${rgba(base, 0)} 100%`;

  const box: React.CSSProperties = horizontal
    ? {top: 0, bottom: 0, width: size, [side === 'left' ? 'left' : 'right']: 0}
    : {left: 0, right: 0, height: size, [side === 'top' ? 'top' : 'bottom']: 0};

  const slide = (1 - p) * (flip ? 30 : -30);

  return (
    <div
      style={{
        position: 'absolute',
        ...box,
        pointerEvents: 'none',
        opacity: p,
        transform: horizontal ? `translateX(${slide}px)` : `translateY(${slide}px)`,
        backdropFilter: `blur(${(blur * p).toFixed(2)}px) saturate(${(100 + 20 * p).toFixed(0)}%)`,
        WebkitBackdropFilter: `blur(${(blur * p).toFixed(2)}px) saturate(${(100 + 20 * p).toFixed(0)}%)`,
        background: `linear-gradient(${axis}, ${tintStops})`,
        maskImage: mask,
        WebkitMaskImage: mask,
        willChange: 'backdrop-filter, opacity, transform',
      }}
    />
  );
};

/* ───────────────────────── ЛИНЕЙКИ ───────────────────────── */

/** Разделитель-градиент вместо сплошной линии. */
export const SoftRule: React.FC<{
  p?: number;
  width?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({p = 1, width = 200, color = '#ffffff', style}) => (
  <div
    style={{
      height: 1,
      width: interpolate(p, [0, 1], [0, width], clamp),
      background: `linear-gradient(to right, ${rgba(color, 0.28)}, ${rgba(color, 0)})`,
      ...style,
    }}
  />
);

export const Rule: React.FC<{
  p: number;
  width?: number;
  color?: string;
  thickness?: number;
  style?: React.CSSProperties;
}> = ({p, width = 72, color = THEME.color.ochre, thickness = 2, style}) => (
  <div
    style={{
      width: interpolate(p, [0, 1], [0, width], clamp),
      height: thickness,
      background: color,
      transformOrigin: 'left center',
      ...style,
    }}
  />
);

/* ──────────────────────────── ЧИСЛА ───────────────────────────── */

export const useCountUp = (
  target: number,
  {delay = 0, duration = 48, decimals = 0}: {delay?: number; duration?: number; decimals?: number} = {}
): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: SPRING_SOFT, durationInFrames: duration});
  const v = s * target;
  return decimals > 0 ? Number(v.toFixed(decimals)) : Math.round(v);
};

export const formatNumber = (n: number, decimals = 0, locale = 'en-US'): string =>
  n.toLocaleString(locale, {minimumFractionDigits: decimals, maximumFractionDigits: decimals});

/* ──────────────────────────── ТИПОГРАФИКА ──────────────────────── */

export const Eyebrow: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({
  children,
  color = THEME.color.ochre,
  size = 13,
}) => (
  <div
    style={{
      fontFamily: THEME.font.sans,
      fontSize: size,
      fontWeight: 600,
      letterSpacing: THEME.track.micro,
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

/* ─────────────────── ПРИВЯЗКА К СЛОВУ ИЗ WHISPERX ─────────────── */

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/** Кадр, на котором произносится фраза. 0 — если не найдена. */
export const useTriggerFrame = (
  words?: WhisperWord[],
  phrase?: string | null,
  occurrence = 0
): number =>
  useMemo(() => {
    if (!words?.length || !phrase) return 0;
    const target = phrase.split(/\s+/).map(norm).filter(Boolean);
    if (!target.length) return 0;
    let hit = 0;
    for (let i = 0; i + target.length <= words.length; i++) {
      let ok = true;
      for (let j = 0; j < target.length; j++) {
        if (norm(words[i + j].word) !== target[j]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        if (hit === occurrence) return words[i].startFrame;
        hit++;
      }
    }
    return 0;
  }, [words, phrase, occurrence]);