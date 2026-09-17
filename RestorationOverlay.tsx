import React, {useMemo} from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, formatNumber, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {RestorationOverlayProps} from './overlayTypes';

/** Детерминированный ГПСЧ — раскладка посадок не должна дрожать между кадрами. */
const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** RESTORATION — «Over the next decade, workers replanted thousands of native trees.» */
export const RestorationOverlay: React.FC<RestorationOverlayProps> = ({
  label,
  count = 90,
  value,
  unit,
  note,
  seed = 7,
  delay = 8,
  side = 'right',
  accent = 'olive',
  wash = true,
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);

  const shell = useMaterialize({delay: at, from: side === 'left' ? 'left' : 'right', shift: 32, blur: 20});
  const plot = useMaterialize({delay: at + 4, from: 'bottom', shift: 16, blur: 14, scale: 0.98});
  const grow = useCountUp(1, {delay: at + 12, duration: 80});
  const shown = useCountUp(value ?? 0, {delay: at + 12, duration: 70});

  const W = 360;
  const H = 230;

  const trees = useMemo(() => {
    const r = rng(seed);
    return Array.from({length: count}, () => ({
      x: 14 + r() * (W - 28),
      y: 18 + r() * (H - 36),
      s: 0.75 + r() * 0.5,
      // порядок появления — «волной», а не случайно
      order: r(),
    })).sort((a, b) => a.y - b.y);
  }, [count, seed]);

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={760} blur={26} /> : null}

      <div style={{position: 'absolute', [side]: 120, bottom: 170, ...shell.style}}>
        <Glass pad="26px 32px 28px" radius={24} strength={22}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: THEME.track.micro,
              textTransform: 'uppercase',
              color: THEME.color.graphite,
              marginBottom: 18,
            }}
          >
            {label}
          </div>

          {/* схема участка */}
          <div
            style={{
              position: 'relative',
              width: W,
              height: H,
              borderRadius: 12,
              background: rgba(THEME.color.ash, 0.45),
              border: `1px solid ${rgba(THEME.color.ivory, 0.12)}`,
              overflow: 'hidden',
              ...plot.style,
            }}
          >
            {/* сетка участка */}
            {[0.25, 0.5, 0.75].map((t) => (
              <React.Fragment key={t}>
                <div style={{position: 'absolute', left: `${t * 100}%`, top: 0, bottom: 0, width: 1, background: rgba(THEME.color.ivory, 0.07)}} />
                <div style={{position: 'absolute', top: `${t * 100}%`, left: 0, right: 0, height: 1, background: rgba(THEME.color.ivory, 0.07)}} />
              </React.Fragment>
            ))}

            {trees.map((t, i) => {
              // деревья проявляются волной снизу вверх с лёгким разбросом
              const start = (i / trees.length) * 0.75 + t.order * 0.2;
              const p = interpolate(grow, [start, Math.min(1, start + 0.14)], [0, 1], clamp);
              if (p <= 0) return null;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: t.x,
                    top: t.y,
                    width: 7 * t.s,
                    height: 11 * t.s,
                    marginLeft: -3.5 * t.s,
                    marginTop: -11 * t.s,
                    borderRadius: '50% 50% 42% 42%',
                    background: rgba(acc, 0.42 + 0.35 * t.s * 0.5),
                    transformOrigin: 'bottom center',
                    transform: `scaleY(${p.toFixed(3)}) scaleX(${(0.6 + 0.4 * p).toFixed(3)})`,
                    opacity: p,
                  }}
                />
              );
            })}
          </div>

          {value !== undefined ? (
            <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 22}}>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 58,
                  fontWeight: 600,
                  lineHeight: 0.9,
                  letterSpacing: '-0.035em',
                  color: THEME.color.paper,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatNumber(shown)}
              </span>
              {unit ? <span style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.16em', color: acc}}>{unit}</span> : null}
            </div>
          ) : null}

          {note ? (
            <div style={{marginTop: 14, fontFamily: THEME.font.sans, fontSize: 15, lineHeight: 1.4, color: THEME.color.graphite, maxWidth: W}}>
              {note}
            </div>
          ) : null}
        </Glass>
      </div>
    </>
  );
};