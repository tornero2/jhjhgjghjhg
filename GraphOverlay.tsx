import React from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {GraphOverlayProps} from './overlayTypes';

/** GRAPH — «Water quality improved every year after 2010.» */
export const GraphOverlay: React.FC<GraphOverlayProps> = ({
  points,
  title,
  unit,
  decimals = 0,
  min,
  max,
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
  const draw = useCountUp(1, {delay: at + 12, duration: 76});
  const fill = useCountUp(1, {delay: at + 40, duration: 46});

  const values = points.map((p) => p.value);
  const lo = min ?? Math.min(...values, 0);
  const hi = max ?? Math.max(...values);
  const span = Math.max(1e-6, hi - lo);

  const W = 420;
  const H = 210;

  const xy = points.map((p, i) => ({
    x: (i / Math.max(1, points.length - 1)) * W,
    y: H - ((p.value - lo) / span) * H,
  }));
  const d = xy.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const dFill = `${d} L${W},${H} L0,${H} Z`;

  // бегущее значение = точка, до которой дорисована линия
  const idx = Math.min(points.length - 1, Math.floor(draw * (points.length - 1) + 0.0001));
  const head = xy[idx];
  const current = points[idx];

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={800} blur={26} /> : null}

      <div style={{position: 'absolute', [side]: 120, top: '50%', transform: 'translateY(-50%)', ...shell.style}}>
        <Glass pad="28px 34px 26px" radius={24} strength={22}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22, gap: 40}}>
            <span
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
            </span>
            <span style={{fontFamily: MONO, fontSize: 24, color: THEME.color.paper, fontVariantNumeric: 'tabular-nums'}}>
              {current.value.toFixed(decimals)}
              {unit ? <span style={{fontSize: 14, color: acc, marginLeft: 6, letterSpacing: '0.14em'}}>{unit}</span> : null}
            </span>
          </div>

          <svg width={W} height={H} style={{display: 'block', overflow: 'visible'}}>
            {/* горизонтальная сетка */}
            {[0, 0.5, 1].map((t) => (
              <line key={t} x1={0} x2={W} y1={t * H} y2={t * H} stroke={rgba(THEME.color.ivory, 0.1)} strokeWidth={1} />
            ))}

            <path d={dFill} fill={rgba(acc, 0.14 * fill)} stroke="none" />
            <path
              d={d}
              fill="none"
              stroke={acc}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={interpolate(draw, [0, 1], [1, 0], clamp)}
            />
            <circle cx={head.x} cy={head.y} r={5} fill={acc} opacity={draw > 0.02 ? 1 : 0} />
            <circle cx={head.x} cy={head.y} r={11} fill="none" stroke={rgba(acc, 0.3)} strokeWidth={1.5} opacity={draw > 0.02 ? 1 : 0} />
          </svg>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 14,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: '0.12em',
              color: THEME.color.graphite,
            }}
          >
            <span>{points[0]?.label}</span>
            <span style={{color: acc}}>{points[points.length - 1]?.label}</span>
          </div>
        </Glass>
      </div>
    </>
  );
};