import React from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, MONO, accentColor, clamp, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {LineChartOverlayProps} from './overlayTypes';

/**
 * LINE_CHART — «Temperatures have fallen steadily since the restoration began.»
 * В отличие от GRAPH это не карточка, а линия во всю ширину кадра:
 * показатель, который тянется через сцену.
 */
export const LineChartOverlay: React.FC<LineChartOverlayProps> = ({
  points,
  title,
  unit,
  decimals = 0,
  min,
  max,
  direction = 'down',
  delay = 8,
  accent,
  wash = true,
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent ?? (direction === 'down' ? 'olive' : 'terracotta'));

  const head = useMaterialize({delay: at, from: 'left', shift: 26, blur: 18});
  const draw = useCountUp(1, {delay: at + 10, duration: 96});

  const values = points.map((p) => p.value);
  const lo = min ?? Math.min(...values);
  const hi = max ?? Math.max(...values);
  const span = Math.max(1e-6, hi - lo);

  // Координаты в процентах кадра: линия живёт в нижней трети.
  const TOP = 62;
  const BOTTOM = 88;
  const xy = points.map((p, i) => ({
    x: 6 + (i / Math.max(1, points.length - 1)) * 88,
    y: TOP + (1 - (p.value - lo) / span) * (BOTTOM - TOP),
  }));
  const d = xy.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

  const idx = Math.min(points.length - 1, Math.floor(draw * (points.length - 1) + 0.0001));
  const tip = xy[idx];
  const current = points[idx];

  return (
    <>
      {wash ? <EdgeWash side="bottom" delay={at - 4} size={620} blur={22} tint={0.3} /> : null}

      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{overflow: 'visible'}}>
          <line x1={6} x2={94} y1={BOTTOM} y2={BOTTOM} stroke={rgba(THEME.color.ivory, 0.12)} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <path
            d={d}
            fill="none"
            stroke={acc}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={interpolate(draw, [0, 1], [1, 0], clamp)}
          />
        </svg>

        {/* бегунок со значением — едет по линии */}
        <div
          style={{
            position: 'absolute',
            left: `${tip.x}%`,
            top: `${tip.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: draw > 0.02 ? head.p : 0,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: acc,
              boxShadow: `0 0 0 7px ${rgba(acc, 0.16)}, 0 4px 14px ${rgba(THEME.color.ink, 0.22)}`,
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: `${tip.x}%`,
            top: `${tip.y}%`,
            transform: 'translate(-50%, -190%)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            ...head.style,
          }}
        >
          <div style={{fontFamily: MONO, fontSize: 34, color: THEME.color.paper, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em'}}>
            {current.value.toFixed(decimals)}
            {unit ? <span style={{fontSize: 17, color: acc, marginLeft: 5, letterSpacing: '0.12em'}}>{unit}</span> : null}
          </div>
          <div style={{marginTop: 5, fontFamily: MONO, fontSize: 12, letterSpacing: '0.14em', color: THEME.color.graphite}}>
            {current.label}
          </div>
        </div>

        {/* заголовок остаётся на месте — якорь для глаза */}
        <div style={{position: 'absolute', left: '6%', top: `${TOP - 10}%`, ...head.style}}>
          <div
            style={{
              fontFamily: THEME.font.sans,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: THEME.track.micro,
              textTransform: 'uppercase',
              color: THEME.color.graphite,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </>
  );
};