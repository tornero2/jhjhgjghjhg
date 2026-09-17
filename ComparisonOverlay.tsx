import React from 'react';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, formatNumber, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {ComparisonOverlayProps, ComparisonSide} from './overlayTypes';

/** COMPARISON — «The restored forest is now twice as dense as it was in 2005.» */
export const ComparisonOverlay: React.FC<ComparisonOverlayProps> = ({
  before,
  after,
  title,
  decimals = 0,
  delay = 8,
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
  const left = useCountUp(before.value, {delay: at + 8, duration: 50, decimals});
  const right = useCountUp(after.value, {delay: at + 18, duration: 50, decimals});
  const grow = useCountUp(1, {delay: at + 10, duration: 56});

  const peak = Math.max(before.value, after.value) || 1;
  const BAR = 190;

  const Column: React.FC<{data: ComparisonSide; shown: number; color: string; muted?: boolean}> = ({
    data,
    shown,
    color,
    muted,
  }) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, minWidth: 190}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
        <span
          style={{
            fontFamily: THEME.font.serif,
            fontSize: 76,
            lineHeight: 0.9,
            letterSpacing: '-0.045em',
            color: muted ? THEME.color.graphite : THEME.color.paper,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatNumber(shown, decimals)}
        </span>
        {data.unit ? <span style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.14em', color}}>{data.unit}</span> : null}
      </div>

      <div style={{width: 110, height: BAR, display: 'flex', alignItems: 'flex-end', background: rgba(THEME.color.ivory, 0.07), borderRadius: 10, overflow: 'hidden'}}>
        <div
          style={{
            width: '100%',
            height: `${(data.value / peak) * grow * 100}%`,
            background: muted ? rgba(THEME.color.graphite, 0.45) : color,
            borderRadius: 10,
          }}
        />
      </div>

      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.14em', color: muted ? THEME.color.graphite : THEME.color.ivory}}>
          {data.label}
        </div>
        {data.caption ? (
          <div style={{marginTop: 8, fontFamily: THEME.font.sans, fontSize: 14, color: THEME.color.graphite, maxWidth: 180}}>
            {data.caption}
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {wash ? <EdgeWash side="bottom" delay={at - 4} size={640} blur={26} tint={0.36} /> : null}

      <div style={{position: 'absolute', left: '50%', bottom: 150, transform: 'translateX(-50%)', ...shell.style}}>
        <Glass pad="30px 48px 34px" radius={26} strength={22}>
          {title ? (
            <div
              style={{
                fontFamily: THEME.font.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: THEME.track.micro,
                textTransform: 'uppercase',
                color: THEME.color.graphite,
                textAlign: 'center',
                marginBottom: 28,
              }}
            >
              {title}
            </div>
          ) : null}

          <div style={{display: 'flex', alignItems: 'flex-end', gap: 44}}>
            <Column data={before} shown={left} color={THEME.color.graphite} muted />
            <div
              style={{
                fontFamily: MONO,
                fontSize: 15,
                letterSpacing: '0.2em',
                color: acc,
                paddingBottom: 96,
              }}
            >
              VS
            </div>
            <Column data={after} shown={right} color={acc} />
          </div>
        </Glass>
      </div>
    </>
  );
};