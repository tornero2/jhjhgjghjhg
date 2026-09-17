import React from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Eyebrow, Rule, accentColor, clamp, formatNumber, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {StatisticOverlayProps} from './overlayTypes';

/** STATISTIC — «By 1985, 70% of the original forest was gone.» */
export const StatisticOverlay: React.FC<StatisticOverlayProps> = ({
  value,
  unit = '%',
  decimals = 0,
  label,
  context,
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

  const shell = useMaterialize({delay: at, from: side === 'left' ? 'left' : 'right', shift: 34, blur: 22});
  const tail = useMaterialize({delay: at + 16, from: 'bottom', shift: 14, blur: 10});
  const shown = useCountUp(value, {delay: at + 6, duration: 52, decimals});

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={860} blur={28} /> : null}

      <div
        style={{
          position: 'absolute',
          [side]: 120,
          bottom: 190,
          maxWidth: 900,
          textAlign: side === 'right' ? 'right' : 'left',
          ...shell.style,
        }}
      >
        <Rule
          p={shell.p}
          width={84}
          color={acc}
          style={{marginBottom: 24, marginLeft: side === 'right' ? 'auto' : 0}}
        />

        <div
          style={{
            fontFamily: THEME.font.serif,
            fontSize: 196,
            lineHeight: 0.84,
            letterSpacing: '-0.055em',
            color: THEME.color.paper,
            fontVariantNumeric: 'tabular-nums',
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            justifyContent: side === 'right' ? 'flex-end' : 'flex-start',
          }}
        >
          <span>{formatNumber(shown, decimals)}</span>
          <span style={{fontSize: 84, letterSpacing: '-0.02em', color: acc}}>{unit}</span>
        </div>

        <div style={{marginTop: 26, ...tail.style}}>
          <div
            style={{
              fontFamily: THEME.font.sans,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: THEME.track.label,
              textTransform: 'uppercase',
              color: THEME.color.ivory,
            }}
          >
            {label}
          </div>
          {context ? (
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: `1px solid ${rgba(THEME.color.ivory, 0.14)}`,
                fontFamily: THEME.font.sans,
                fontSize: 18,
                lineHeight: 1.45,
                color: THEME.color.graphite,
                maxWidth: 520,
                marginLeft: side === 'right' ? 'auto' : 0,
                opacity: interpolate(tail.p, [0, 1], [0, 1], clamp),
              }}
            >
              {context}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};