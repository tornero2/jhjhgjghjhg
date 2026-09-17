import React from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, formatNumber, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {PopulationOverlayProps} from './overlayTypes';

/** POPULATION — «Only 300 wolves remained in the region.» */
export const PopulationOverlay: React.FC<PopulationOverlayProps> = ({
  label,
  value,
  unit,
  trend,
  note,
  delay = 8,
  side = 'right',
  accent = 'terracotta',
  wash = true,
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);

  const shell = useMaterialize({delay: at, from: side === 'left' ? 'left' : 'right', shift: 34, blur: 22});
  const shown = useCountUp(value, {delay: at + 6, duration: 50});
  const draw = useCountUp(1, {delay: at + 14, duration: 52});

  const W = 300;
  const H = 74;
  const path = (trend ?? []).map((v, i, arr) => {
    const x = (i / Math.max(1, arr.length - 1)) * W;
    const y = H - Math.min(1, Math.max(0, v)) * H;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={740} blur={26} /> : null}

      <div style={{position: 'absolute', [side]: 120, bottom: 180, ...shell.style}}>
        <Glass pad="28px 36px 30px" radius={24} strength={22}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: THEME.track.micro,
              textTransform: 'uppercase',
              color: THEME.color.graphite,
              marginBottom: 16,
            }}
          >
            {label}
          </div>

          <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
            <span
              style={{
                fontFamily: THEME.font.serif,
                fontSize: 116,
                lineHeight: 0.86,
                letterSpacing: '-0.05em',
                color: THEME.color.paper,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatNumber(shown)}
            </span>
            {unit ? (
              <span
                style={{
                  fontFamily: THEME.font.sans,
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: THEME.track.label,
                  textTransform: 'uppercase',
                  color: acc,
                }}
              >
                {unit}
              </span>
            ) : null}
          </div>

          {trend?.length ? (
            <svg width={W} height={H} style={{marginTop: 24, display: 'block', overflow: 'visible'}}>
              <path d={`M0,${H} L${W},${H}`} stroke={rgba(THEME.color.ivory, 0.14)} strokeWidth={1} fill="none" />
              <path
                d={path}
                fill="none"
                stroke={acc}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={interpolate(draw, [0, 1], [1, 0], clamp)}
              />
            </svg>
          ) : null}

          {note ? (
            <div
              style={{
                marginTop: 18,
                fontFamily: THEME.font.sans,
                fontSize: 16,
                lineHeight: 1.4,
                color: THEME.color.graphite,
                maxWidth: 300,
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