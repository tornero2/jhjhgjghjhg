import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SPRING_SOFT, THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, useMaterialize, useTriggerFrame} from './_core';
import type {CauseEffectOverlayProps} from './overlayTypes';

/** CAUSE_EFFECT — «DAM REMOVED → COLDER WATER → SALMON RETURN». */
export const CauseEffectOverlay: React.FC<CauseEffectOverlayProps> = ({
  steps,
  title,
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

  const shell = useMaterialize({delay: at, from: 'bottom', shift: 28, blur: 20});
  const gap = 16;

  return (
    <>
      {wash ? <EdgeWash side="bottom" delay={at - 4} size={480} blur={24} tint={0.34} /> : null}

      <div style={{position: 'absolute', left: '50%', bottom: 170, transform: 'translateX(-50%)', ...shell.style}}>
        <Glass pad="28px 40px 30px" radius={26} strength={22}>
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
                marginBottom: 24,
              }}
            >
              {title}
            </div>
          ) : null}

          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            {steps.map((s, i) => {
              const at2 = at + 8 + i * gap;
              const p = spring({frame: frame - at2, fps, config: SPRING_SOFT, durationInFrames: 30});
              const arrow = spring({frame: frame - at2 + 6, fps, config: SPRING_SOFT, durationInFrames: 22});
              return (
                <React.Fragment key={i}>
                  {i > 0 ? (
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 26,
                        color: acc,
                        opacity: arrow,
                        transform: `translateX(${interpolate(arrow, [0, 1], [-10, 0], clamp)}px)`,
                      }}
                    >
                      →
                    </div>
                  ) : null}

                  <div
                    style={{
                      opacity: p,
                      filter: `blur(${(1 - p) * 10}px)`,
                      transform: `translateY(${(1 - p) * 14}px) scale(${interpolate(p, [0, 1], [0.96, 1], clamp)})`,
                      padding: '16px 24px',
                      borderRadius: 14,
                      background: i === steps.length - 1 ? rgba(acc, 0.14) : rgba(THEME.color.ivory, 0.05),
                      border: `1px solid ${i === steps.length - 1 ? rgba(acc, 0.35) : rgba(THEME.color.ivory, 0.12)}`,
                      fontFamily: MONO,
                      fontSize: 19,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: i === steps.length - 1 ? THEME.color.oliveDeep : THEME.color.ivory,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </Glass>
      </div>
    </>
  );
};