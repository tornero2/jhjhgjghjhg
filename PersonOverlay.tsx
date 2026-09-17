import React from 'react';
import {Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SPRING_SOFT, THEME, rgba} from '../theme';
import {
  EdgeWash,
  Glass,
  MONO,
  ZONE,
  accentColor,
  clamp,
  onGlass,
  useMaterialize,
  useTriggerFrame,
} from './_core';
import type {PersonOverlayProps} from './overlayTypes';

/** PERSON — метка участника. Тёмное стекло поверх кадра, жёсткая иерархия. */
export const PersonOverlay: React.FC<PersonOverlayProps> = ({
  name,
  role,
  note,
  portrait,
  delay = 6,
  side = 'left',
  accent = 'ochre',
  wash = false,
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);
  const ink = onGlass('dark');

  const shell = useMaterialize({
    delay: at,
    from: side === 'left' ? 'left' : 'right',
    shift: 30,
    blur: 22,
    scale: 0.96,
  });

  const line = (i: number) =>
    spring({frame: frame - at - 10 - i * 5, fps, config: SPRING_SOFT, durationInFrames: 30});

  const face = useMaterialize({delay: at + 6, from: 'center', shift: 0, blur: 16, scale: 0.86});
  const rail = spring({frame: frame - at - 8, fps, config: SPRING_SOFT, durationInFrames: 34});

  const n0 = line(0);
  const n1 = line(1);
  const n2 = line(2);

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={620} blur={22} tint={0.34} tone="dark" /> : null}

      <div style={{position: 'absolute', [side]: ZONE.edge, bottom: ZONE.bottom, ...shell.style}}>
        <Glass
          tier="chip"
          tone="dark"
          p={shell.p}
          pad={portrait ? '18px 34px 18px 18px' : '22px 34px 22px 26px'}
        >
          <div style={{display: 'flex', alignItems: 'stretch', gap: 22}}>
            {/* Якорная рейка — растёт снизу вверх, задаёт левый край блока */}
            <div
              style={{
                width: 3,
                borderRadius: 2,
                background: rgba('#ffffff', 0.14),
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${rail * 100}%`,
                  marginTop: `${(1 - rail) * 100}%`,
                  background: acc,
                  borderRadius: 2,
                }}
              />
            </div>

            {portrait ? (
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 22,
                  overflow: 'hidden',
                  flexShrink: 0,
                  alignSelf: 'center',
                  boxShadow: `inset 0 0 0 1px ${rgba('#ffffff', 0.16)}, 0 10px 26px ${rgba(
                    THEME.color.ink,
                    0.34
                  )}`,
                  ...face.style,
                }}
              >
                <Img src={portrait} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            ) : null}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingRight: 6,
              }}
            >
              {/* Роль идёт первой и мелкой — сначала контекст, потом имя */}
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: THEME.track.micro,
                  textTransform: 'uppercase',
                  color: acc,
                  opacity: n0,
                  transform: `translateX(${(1 - n0) * 10}px)`,
                  marginBottom: 9,
                }}
              >
                {role}
              </div>

              <div
                style={{
                  fontFamily: THEME.font.serif,
                  fontSize: 46,
                  lineHeight: 0.98,
                  letterSpacing: '-0.03em',
                  color: ink.primary,
                  opacity: n1,
                  filter: `blur(${(1 - n1) * 6}px)`,
                  transform: `translateX(${(1 - n1) * 12}px)`,
                }}
              >
                {name}
              </div>

              {note ? (
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 13,
                    maxWidth: 440,
                    fontFamily: THEME.font.sans,
                    fontSize: 16,
                    lineHeight: 1.42,
                    color: ink.secondary,
                    opacity: n2,
                    transform: `translateX(${(1 - n2) * 8}px)`,
                    // градиентный разделитель вместо border
                    backgroundImage: `linear-gradient(to right, ${ink.hairline}, ${rgba('#ffffff', 0)})`,
                    backgroundSize: `${interpolate(n2, [0, 1], [0, 100], clamp)}% 1px`,
                    backgroundPosition: 'top left',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {note}
                </div>
              ) : null}
            </div>
          </div>
        </Glass>
      </div>
    </>
  );
};