import React from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, formatNumber, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {Point2D, RouteOverlayProps} from './overlayTypes';

const DEFAULT_ROUTE: Point2D[] = [
  {x: 0.18, y: 0.74},
  {x: 0.34, y: 0.62},
  {x: 0.46, y: 0.66},
  {x: 0.62, y: 0.48},
  {x: 0.78, y: 0.4},
];

/** ROUTE — «The salmon travel nearly 200 miles upstream to spawn.» */
export const RouteOverlay: React.FC<RouteOverlayProps> = ({
  label,
  distance,
  unit = 'MI',
  origin,
  destination,
  points = DEFAULT_ROUTE,
  note,
  delay = 8,
  side = 'left',
  accent = 'ochre',
  wash = true,
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);

  const shell = useMaterialize({delay: at, from: side === 'left' ? 'left' : 'right', shift: 32, blur: 20});
  const map = useMaterialize({delay: at + 4, from: 'center', shift: 0, blur: 14, scale: 0.995});
  const draw = useCountUp(1, {delay: at + 12, duration: 70});
  const shown = useCountUp(distance ?? 0, {delay: at + 12, duration: 60});

  // Точка, бегущая по ломаной: идём по накопленной длине сегментов.
  const seg = points.slice(1).map((p, i) => {
    const a = points[i];
    return Math.hypot(p.x - a.x, p.y - a.y);
  });
  const total = seg.reduce((s, v) => s + v, 0) || 1;
  let acc2 = 0;
  let head = points[points.length - 1];
  const target = draw * total;
  for (let i = 0; i < seg.length; i++) {
    if (acc2 + seg[i] >= target) {
      const t = seg[i] === 0 ? 0 : (target - acc2) / seg[i];
      head = {
        x: points[i].x + (points[i + 1].x - points[i].x) * t,
        y: points[i].y + (points[i + 1].y - points[i].y) * t,
      };
      break;
    }
    acc2 += seg[i];
  }

  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${(p.x * 100).toFixed(2)},${(p.y * 100).toFixed(2)}`).join(' ');

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={700} blur={24} tint={0.32} /> : null}

      {/* слой маршрута — во весь кадр, в процентных координатах */}
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', ...map.style}}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{overflow: 'visible'}}>
          <path d={d} fill="none" stroke={rgba(THEME.color.ivory, 0.16)} strokeWidth={0.28} vectorEffect="non-scaling-stroke" />
          <path
            d={d}
            fill="none"
            stroke={acc}
            strokeWidth={0.55}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={interpolate(draw, [0, 1], [1, 0], clamp)}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            left: `${head.x * 100}%`,
            top: `${head.y * 100}%`,
            width: 16,
            height: 16,
            marginLeft: -8,
            marginTop: -8,
            borderRadius: '50%',
            background: acc,
            boxShadow: `0 0 0 6px ${rgba(acc, 0.18)}, 0 4px 14px ${rgba(THEME.color.ink, 0.25)}`,
            opacity: map.p,
          }}
        />
      </div>

      <div style={{position: 'absolute', [side]: 120, bottom: 160, ...shell.style}}>
        <Glass pad="26px 34px 28px" radius={24} strength={22}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: THEME.track.micro,
              textTransform: 'uppercase',
              color: THEME.color.graphite,
              marginBottom: 14,
            }}
          >
            {label}
          </div>

          {distance !== undefined ? (
            <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
              <span
                style={{
                  fontFamily: THEME.font.serif,
                  fontSize: 92,
                  lineHeight: 0.88,
                  letterSpacing: '-0.05em',
                  color: THEME.color.paper,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatNumber(shown)}
              </span>
              <span style={{fontFamily: MONO, fontSize: 22, letterSpacing: '0.14em', color: acc}}>{unit}</span>
            </div>
          ) : null}

          {origin || destination ? (
            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: `1px solid ${rgba(THEME.color.ivory, 0.13)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: MONO,
                fontSize: 14,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: THEME.color.graphite,
              }}
            >
              <span>{origin}</span>
              <span style={{color: acc}}>→</span>
              <span style={{color: THEME.color.ivory}}>{destination}</span>
            </div>
          ) : null}

          {note ? (
            <div style={{marginTop: 14, fontFamily: THEME.font.sans, fontSize: 16, lineHeight: 1.4, color: THEME.color.graphite, maxWidth: 340}}>
              {note}
            </div>
          ) : null}
        </Glass>
      </div>
    </>
  );
};