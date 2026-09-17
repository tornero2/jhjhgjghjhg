import React from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Eyebrow, Glass, MONO, accentColor, clamp, formatNumber, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {AreaOverlayProps, Point2D} from './overlayTypes';

const DEFAULT_OUTLINE: Point2D[] = [
  {x: 0.3, y: 0.3},
  {x: 0.62, y: 0.26},
  {x: 0.76, y: 0.44},
  {x: 0.7, y: 0.7},
  {x: 0.42, y: 0.76},
  {x: 0.26, y: 0.54},
];

/** AREA — «The project restored 18,000 acres of wetlands.» */
export const AreaOverlay: React.FC<AreaOverlayProps> = ({
  value,
  unit = 'ACRES',
  label,
  decimals = 0,
  outline = DEFAULT_OUTLINE,
  note,
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
  const plot = useMaterialize({delay: at + 4, from: 'center', shift: 0, blur: 12, scale: 0.985});
  const draw = useCountUp(1, {delay: at + 10, duration: 64});
  const fill = useCountUp(1, {delay: at + 34, duration: 44});
  const shown = useCountUp(value, {delay: at + 12, duration: 58, decimals});

  const d =
    outline.map((p, i) => `${i === 0 ? 'M' : 'L'}${(p.x * 100).toFixed(2)},${(p.y * 100).toFixed(2)}`).join(' ') + ' Z';

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={720} blur={24} tint={0.3} /> : null}

      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', ...plot.style}}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{overflow: 'visible'}}>
          <path d={d} fill={rgba(acc, 0.16 * fill)} stroke="none" />
          <path
            d={d}
            fill="none"
            stroke={acc}
            strokeWidth={0.5}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={interpolate(draw, [0, 1], [1, 0], clamp)}
          />
        </svg>
      </div>

      <div style={{position: 'absolute', [side]: 120, bottom: 170, ...shell.style}}>
        <Glass pad="26px 34px 28px" radius={24} strength={22}>
          <Eyebrow color={acc}>{label}</Eyebrow>

          <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 16}}>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 82,
                fontWeight: 600,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: THEME.color.paper,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatNumber(shown, decimals)}
            </span>
            <span style={{fontFamily: MONO, fontSize: 20, letterSpacing: '0.16em', color: acc}}>{unit}</span>
          </div>

          {note ? (
            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: `1px solid ${rgba(THEME.color.ivory, 0.13)}`,
                fontFamily: THEME.font.sans,
                fontSize: 16,
                lineHeight: 1.4,
                color: THEME.color.graphite,
                maxWidth: 340,
              }}
            >
              {note}
            </div>
          ) : null}
        </Glass>
      </div>
    </>
  );
};