import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SPRING_SOFT, THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, formatNumber, useMaterialize, useTriggerFrame} from './_core';
import type {BarChartOverlayProps} from './overlayTypes';

/** BAR_CHART — «The number of beavers, otters and salmon all increased.» */
export const BarChartOverlay: React.FC<BarChartOverlayProps> = ({
  bars,
  title,
  unit,
  decimals = 0,
  delay = 8,
  accent = 'olive',
  wash = true,
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);

  const shell = useMaterialize({delay: at, from: 'bottom', shift: 30, blur: 20});
  const peak = Math.max(...bars.map((b) => b.value), 1);
  const H = 240;

  return (
    <>
      {wash ? <EdgeWash side="bottom" delay={at - 4} size={620} blur={26} tint={0.34} /> : null}

      <div style={{position: 'absolute', left: '50%', bottom: 150, transform: 'translateX(-50%)', ...shell.style}}>
        <Glass pad="28px 44px 30px" radius={26} strength={22}>
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

          <div style={{display: 'flex', alignItems: 'flex-end', gap: 34, height: H}}>
            {bars.map((b, i) => {
              const p = spring({frame: frame - at - 12 - i * 10, fps, config: SPRING_SOFT, durationInFrames: 44});
              const h = (b.value / peak) * (H - 46) * p;
              const shown = decimals > 0 ? (b.value * p).toFixed(decimals) : formatNumber(Math.round(b.value * p));
              return (
                <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: 104, height: '100%'}}>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 22,
                      color: THEME.color.paper,
                      marginBottom: 12,
                      opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {shown}
                    {unit ? <span style={{fontSize: 12, color: acc, marginLeft: 4, letterSpacing: '0.12em'}}>{unit}</span> : null}
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: h,
                      borderRadius: '10px 10px 4px 4px',
                      background: `linear-gradient(to top, ${rgba(acc, 0.55)}, ${acc})`,
                      boxShadow: `0 6px 18px ${rgba(acc, 0.22 * p)}`,
                    }}
                  />

                  <div
                    style={{
                      marginTop: 14,
                      fontFamily: MONO,
                      fontSize: 13,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: THEME.color.graphite,
                      textAlign: 'center',
                      opacity: p,
                    }}
                  >
                    {b.label}
                  </div>
                </div>
              );
            })}
          </div>
        </Glass>
      </div>
    </>
  );
};