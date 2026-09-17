import React from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, formatNumber, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {CounterOverlayProps} from './overlayTypes';

/** COUNTER — «0 → 2,000,000 TREES»: накопительный итог. */
export const CounterOverlay: React.FC<CounterOverlayProps> = ({
  to,
  from = 0,
  label,
  prefix,
  suffix,
  decimals = 0,
  locale = 'en-US',
  delay = 6,
  side = 'left',
  accent = 'olive',
  wash = true,
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);

  const shell = useMaterialize({delay: at, from: 'bottom', shift: 30, blur: 20});
  const progress = useCountUp(1, {delay: at + 4, duration: 60});
  const shown = from + (to - from) * progress;

  return (
    <>
      {wash ? <EdgeWash side="bottom" delay={at - 4} size={520} blur={24} tint={0.34} /> : null}

      <div style={{position: 'absolute', [side]: 120, bottom: 150, ...shell.style}}>
        <Glass pad="30px 40px 26px" radius={26} strength={22}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: THEME.track.micro,
              textTransform: 'uppercase',
              color: THEME.color.graphite,
              marginBottom: 14,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <span>{formatNumber(from, decimals, locale)}</span>
            <span style={{color: acc}}>→</span>
            <span>{formatNumber(to, decimals, locale)}</span>
          </div>

          <div
            style={{
              fontFamily: MONO,
              fontSize: 108,
              fontWeight: 600,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              color: THEME.color.paper,
              fontVariantNumeric: 'tabular-nums',
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
            }}
          >
            {prefix ? <span style={{fontSize: 52, color: THEME.color.graphite}}>{prefix}</span> : null}
            <span>{formatNumber(shown, decimals, locale)}</span>
            {suffix ? <span style={{fontSize: 48, color: acc, letterSpacing: '-0.01em'}}>{suffix}</span> : null}
          </div>

          {/* линейка заполнения — тот же прогресс, что и у числа */}
          <div style={{marginTop: 22, height: 3, borderRadius: 2, background: rgba(THEME.color.ivory, 0.1)}}>
            <div
              style={{
                width: `${interpolate(progress, [0, 1], [0, 100], clamp)}%`,
                height: '100%',
                borderRadius: 2,
                background: acc,
              }}
            />
          </div>

          <div
            style={{
              marginTop: 14,
              fontFamily: THEME.font.sans,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: THEME.track.label,
              textTransform: 'uppercase',
              color: THEME.color.ivory,
            }}
          >
            {label}
          </div>
        </Glass>
      </div>
    </>
  );
};