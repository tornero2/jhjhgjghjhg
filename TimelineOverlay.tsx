import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SPRING_SOFT, THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, useMaterialize, useTriggerFrame} from './_core';
import type {TimelineOverlayProps} from './overlayTypes';

/** TIMELINE — «built in 1952, abandoned in 1998, and removed in 2011». */
export const TimelineOverlay: React.FC<TimelineOverlayProps> = ({
  events,
  title,
  delay = 8,
  accent = 'ochre',
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
  const step = 14;
  const line = spring({frame: frame - at - 6, fps, config: SPRING_SOFT, durationInFrames: 30 + events.length * step});

  return (
    <>
      {wash ? <EdgeWash side="bottom" delay={at - 4} size={560} blur={24} tint={0.36} /> : null}

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 160,
          transform: 'translateX(-50%)',
          ...shell.style,
        }}
      >
        <Glass pad="30px 52px 34px" radius={26} strength={22}>
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
                textAlign: 'center',
              }}
            >
              {title}
            </div>
          ) : null}

          <div style={{position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 86}}>
            {/* рельс */}
            <div
              style={{
                position: 'absolute',
                left: 7,
                right: 7,
                top: 7,
                height: 1,
                background: rgba(THEME.color.ivory, 0.16),
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 7,
                top: 7,
                height: 1,
                width: `calc((100% - 14px) * ${interpolate(line, [0, 1], [0, 1], clamp)})`,
                background: acc,
              }}
            />

            {events.map((e, i) => {
              const s = spring({
                frame: frame - at - 12 - i * step,
                fps,
                config: SPRING_SOFT,
                durationInFrames: 30,
              });
              return (
                <div key={i} style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 110}}>
                  <div
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: '50%',
                      background: THEME.color.slateRaised,
                      border: `2px solid ${acc}`,
                      transform: `scale(${interpolate(s, [0, 1], [0.2, 1], clamp)})`,
                      opacity: s,
                      boxShadow: `0 0 0 ${(1 - s) * 10}px ${rgba(acc, 0.12 * s)}`,
                    }}
                  />
                  <div
                    style={{
                      marginTop: 18,
                      opacity: s,
                      transform: `translateY(${(1 - s) * 10}px)`,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 30,
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        color: THEME.color.paper,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {e.year}
                    </div>
                    {e.label ? (
                      <div
                        style={{
                          marginTop: 7,
                          fontFamily: THEME.font.sans,
                          fontSize: 13,
                          letterSpacing: THEME.track.micro,
                          textTransform: 'uppercase',
                          color: THEME.color.graphite,
                          maxWidth: 140,
                        }}
                      >
                        {e.label}
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