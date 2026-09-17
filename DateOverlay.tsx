import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SPRING_SOFT, THEME} from '../theme';
import {EdgeWash, Eyebrow, Rule, accentColor, clamp, useMaterialize, useTriggerFrame} from './_core';
import type {DateOverlayProps} from './overlayTypes';

/** DATE — «In 1987, the state launched its restoration program.» */
export const DateOverlay: React.FC<DateOverlayProps> = ({
  year,
  label,
  context,
  delay = 6,
  side = 'right',
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

  const shell = useMaterialize({delay: at, from: side === 'left' ? 'left' : 'right', shift: 30, blur: 20});
  const digits = year.split('');

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={720} blur={26} tint={0.36} /> : null}

      <div
        style={{
          position: 'absolute',
          [side]: 130,
          bottom: 200,
          textAlign: side === 'right' ? 'right' : 'left',
          ...shell.style,
        }}
      >
        {label ? <Eyebrow color={acc}>{label}</Eyebrow> : null}

        {/* каждая цифра выезжает из-под маски — с интервалом, но общей пружиной */}
        <div style={{display: 'flex', gap: 2, marginTop: 16, justifyContent: side === 'right' ? 'flex-end' : 'flex-start'}}>
          {digits.map((d, i) => {
            const s = spring({
              frame: frame - at - 8 - i * 4,
              fps,
              config: SPRING_SOFT,
              durationInFrames: 36,
            });
            return (
              <span key={i} style={{overflow: 'hidden', display: 'inline-block', paddingBottom: 10}}>
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${interpolate(s, [0, 1], [110, 0], clamp)}%)`,
                    fontFamily: THEME.font.serif,
                    fontSize: 168,
                    lineHeight: 0.86,
                    letterSpacing: '-0.05em',
                    color: THEME.color.paper,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {d}
                </span>
              </span>
            );
          })}
        </div>

        <Rule
          p={shell.p}
          width={120}
          color={acc}
          style={{marginTop: 18, marginLeft: side === 'right' ? 'auto' : 0}}
        />

        {context ? (
          <div
            style={{
              marginTop: 18,
              maxWidth: 440,
              marginLeft: side === 'right' ? 'auto' : 0,
              fontFamily: THEME.font.sans,
              fontSize: 19,
              lineHeight: 1.45,
              color: THEME.color.graphite,
            }}
          >
            {context}
          </div>
        ) : null}
      </div>
    </>
  );
};