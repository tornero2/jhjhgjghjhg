import React from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {TemperatureOverlayProps} from './overlayTypes';

/** TEMPERATURE — «The river was reaching 75 degrees every summer.» */
export const TemperatureOverlay: React.FC<TemperatureOverlayProps> = ({
  value,
  unit = '°F',
  label,
  decimals = 0,
  min = 40,
  max = 90,
  delta,
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

  const shell = useMaterialize({delay: at, from: side === 'left' ? 'left' : 'right', shift: 32, blur: 20});
  const rise = useCountUp(1, {delay: at + 8, duration: 56});
  const shown = value * rise;
  const ratio = Math.min(1, Math.max(0, (shown - min) / Math.max(1, max - min)));

  const H = 260;

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={640} blur={24} tint={0.3} /> : null}

      <div style={{position: 'absolute', [side]: 120, top: '50%', transform: 'translateY(-50%)', ...shell.style}}>
        <Glass pad="30px 34px" radius={26} strength={22}>
          <div style={{display: 'flex', alignItems: 'stretch', gap: 28}}>
            {/* шкала */}
            <div style={{position: 'relative', width: 14, height: H, borderRadius: 999, background: rgba(THEME.color.ivory, 0.1), overflow: 'hidden'}}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: `${ratio * 100}%`,
                  borderRadius: 999,
                  background: `linear-gradient(to top, ${rgba(acc, 0.55)}, ${acc})`,
                }}
              />
              {/* риски */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <div
                  key={t}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: `${t * 100}%`,
                    height: 1,
                    background: rgba(THEME.color.ivory, 0.18),
                  }}
                />
              ))}
            </div>

            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    letterSpacing: THEME.track.micro,
                    textTransform: 'uppercase',
                    color: THEME.color.graphite,
                  }}
                >
                  {label}
                </div>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 16}}>
                  <span
                    style={{
                      fontFamily: THEME.font.serif,
                      fontSize: 108,
                      lineHeight: 0.86,
                      letterSpacing: '-0.05em',
                      color: THEME.color.paper,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {shown.toFixed(decimals)}
                  </span>
                  <span style={{fontFamily: THEME.font.serif, fontSize: 52, color: acc}}>{unit}</span>
                </div>
              </div>

              {delta !== undefined ? (
                <div
                  style={{
                    marginTop: 26,
                    paddingTop: 14,
                    borderTop: `1px solid ${rgba(THEME.color.ivory, 0.13)}`,
                    fontFamily: MONO,
                    fontSize: 16,
                    letterSpacing: '0.1em',
                    color: delta < 0 ? THEME.color.oliveDeep : acc,
                    opacity: interpolate(rise, [0.6, 1], [0, 1], clamp),
                  }}
                >
                  {delta > 0 ? '+' : ''}
                  {delta.toFixed(1)} {unit}
                </div>
              ) : null}

              <div
                style={{
                  marginTop: 12,
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  color: THEME.color.graphite,
                }}
              >
                {min}{unit} — {max}{unit}
              </div>
            </div>
          </div>
        </Glass>
      </div>
    </>
  );
};