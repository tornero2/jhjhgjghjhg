import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SPRING_SOFT, THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, useMaterialize, useTriggerFrame} from './_core';
import type {ProcessOverlayProps} from './overlayTypes';

/** PROCESS — «First, workers removed the invasive plants. Then they replanted…» */
export const ProcessOverlay: React.FC<ProcessOverlayProps> = ({
  steps,
  title,
  delay = 8,
  side = 'left',
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

  const shell = useMaterialize({delay: at, from: side === 'left' ? 'left' : 'right', shift: 32, blur: 20});
  const gap = 18;
  const rail = spring({
    frame: frame - at - 10,
    fps,
    config: SPRING_SOFT,
    durationInFrames: 26 + steps.length * gap,
  });

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={760} blur={26} /> : null}

      <div style={{position: 'absolute', [side]: 120, top: '50%', transform: 'translateY(-50%)', ...shell.style}}>
        <Glass pad="30px 40px 32px" radius={24} strength={22}>
          {title ? (
            <div
              style={{
                fontFamily: THEME.font.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: THEME.track.micro,
                textTransform: 'uppercase',
                color: THEME.color.graphite,
                marginBottom: 26,
              }}
            >
              {title}
            </div>
          ) : null}

          <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 26}}>
            {/* вертикальный рельс, растущий сверху вниз */}
            <div
              style={{
                position: 'absolute',
                left: 15,
                top: 16,
                bottom: 16,
                width: 1,
                background: rgba(THEME.color.ivory, 0.14),
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 15,
                top: 16,
                width: 1,
                height: `calc((100% - 32px) * ${interpolate(rail, [0, 1], [0, 1], clamp)})`,
                background: acc,
              }}
            />

            {steps.map((s, i) => {
              const p = spring({frame: frame - at - 14 - i * gap, fps, config: SPRING_SOFT, durationInFrames: 30});
              return (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 22,
                    opacity: p,
                    filter: `blur(${(1 - p) * 8}px)`,
                    transform: `translateX(${(1 - p) * 14}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 31,
                      height: 31,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: rgba(THEME.color.slateRaised, 0.95),
                      border: `1.5px solid ${acc}`,
                      fontFamily: MONO,
                      fontSize: 13,
                      color: acc,
                      transform: `scale(${interpolate(p, [0, 1], [0.4, 1], clamp)})`,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <div style={{paddingTop: 3, maxWidth: 420}}>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 19,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: THEME.color.paper,
                      }}
                    >
                      {s.title}
                    </div>
                    {s.detail ? (
                      <div
                        style={{
                          marginTop: 8,
                          fontFamily: THEME.font.sans,
                          fontSize: 16,
                          lineHeight: 1.45,
                          color: THEME.color.graphite,
                        }}
                      >
                        {s.detail}
                      </div>
                    ) : null}
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