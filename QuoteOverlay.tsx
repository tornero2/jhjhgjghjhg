import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SPRING_SOFT, THEME, rgba} from '../theme';
import {MONO, SoftRule, Scrim, ZONE, accentColor, clamp, useMaterialize, useTriggerFrame} from './_core';
import type {QuoteOverlayProps} from './overlayTypes';

/** QUOTE — момент, забирающий кадр. Фон уходит назад, текст выходит вперёд. */
export const QuoteOverlay: React.FC<QuoteOverlayProps> = ({
  text,
  author,
  role,
  delay = 6,
  side = 'left',
  accent = 'ochre',
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);

  const words = text.split(' ');
  const STEP = 1.8;

  const mark = useMaterialize({delay: at + 4, from: 'center', shift: 0, blur: 26, scale: 0.6});
  const tail = spring({
    frame: frame - at - 14 - words.length * STEP,
    fps,
    config: SPRING_SOFT,
    durationInFrames: 34,
  });

  // Кегль подстраивается под длину — короткая реплика звучит громче длинной
  const size = words.length <= 8 ? 82 : words.length <= 16 ? 64 : 50;

  return (
    <>
      <Scrim side={side} delay={at - 6} blur={22} veil={0.76} />

      <div
        style={{
          position: 'absolute',
          [side]: ZONE.edge,
          top: '50%',
          transform: 'translateY(-52%)',
          width: Math.min(width * 0.52, 1020),
        }}
      >
        {/* Кавычка — графика, а не символ в строке: крупная, приглушённая, за текстом */}
        <div
          style={{
            position: 'absolute',
            left: -18,
            top: -size * 0.72,
            fontFamily: THEME.font.serif,
            fontSize: size * 3.4,
            lineHeight: 1,
            color: rgba(acc, 0.16),
            userSelect: 'none',
            ...mark.style,
          }}
        >
          “
        </div>

        <div style={{position: 'relative', display: 'flex', flexWrap: 'wrap', gap: `0 ${size * 0.26}px`}}>
          {words.map((w, i) => {
            const p = spring({frame: frame - at - 10 - i * STEP, fps, config: SPRING_SOFT, durationInFrames: 34});
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: p,
                  // слово не выезжает, а проявляется из расфокуса — вместе с масштабом
                  filter: `blur(${((1 - p) * 14).toFixed(2)}px)`,
                  transform: `translateY(${((1 - p) * 10).toFixed(2)}px) scale(${interpolate(
                    p,
                    [0, 1],
                    [0.97, 1],
                    clamp
                  ).toFixed(4)})`,
                  fontFamily: THEME.font.serif,
                  fontSize: size,
                  lineHeight: 1.18,
                  // крупный кегль — отрицательный трекинг
                  letterSpacing: '-0.03em',
                  color: THEME.color.ink,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>

        {/* Атрибуция: выровнена по левому краю блока, не центр, не рамка */}
        <div
          style={{
            marginTop: 38,
            opacity: tail,
            transform: `translateY(${(1 - tail) * 10}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{width: 3, height: 34, borderRadius: 2, background: acc, opacity: tail}} />
          <div>
            <div
              style={{
                fontFamily: THEME.font.sans,
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: THEME.color.paper,
                lineHeight: 1.1,
              }}
            >
              {author}
            </div>
            {role ? (
              <div
                style={{
                  marginTop: 6,
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: THEME.track.micro,
                  textTransform: 'uppercase',
                  color: acc,
                  opacity: interpolate(tail, [0.4, 1], [0, 1], clamp),
                }}
              >
                {role}
              </div>
            ) : null}
          </div>
        </div>

        <SoftRule p={tail} width={260} style={{marginTop: 26}} />
      </div>
    </>
  );
};