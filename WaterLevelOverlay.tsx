import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, useCountUp, useMaterialize, useTriggerFrame} from './_core';
import type {WaterLevelOverlayProps} from './overlayTypes';

/** WATER_LEVEL — «Water levels dropped by nearly six feet.» */
export const WaterLevelOverlay: React.FC<WaterLevelOverlayProps> = ({
  value,
  unit = 'FT',
  label,
  decimals = 0,
  fromLevel = 0.82,
  toLevel = 0.34,
  note,
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
  const drop = useCountUp(1, {delay: at + 10, duration: 70});
  const eased = EASE.inOut(drop);
  const level = fromLevel + (toLevel - fromLevel) * eased;
  const shown = value * drop;

  // мягкая рябь на поверхности — медленная, без «мигания»
  const wave = Math.sin(((frame - at) / fps) * Math.PI * 0.9) * 3;

  const W = 300;
  const H = 230;

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={700} blur={24} tint={0.3} /> : null}

      <div style={{position: 'absolute', [side]: 120, bottom: 170, ...shell.style}}>
        <Glass pad="26px 32px 28px" radius={24} strength={22}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: THEME.track.micro,
              textTransform: 'uppercase',
              color: THEME.color.graphite,
              marginBottom: 18,
            }}
          >
            {label}
          </div>

          <div style={{display: 'flex', gap: 26, alignItems: 'flex-end'}}>
            {/* резервуар */}
            <div
              style={{
                position: 'relative',
                width: W,
                height: H,
                borderRadius: 14,
                overflow: 'hidden',
                background: rgba(THEME.color.ash, 0.5),
                border: `1px solid ${rgba(THEME.color.ivory, 0.12)}`,
              }}
            >
              {/* исходный уровень — пунктиром */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: `${fromLevel * 100}%`,
                  height: 0,
                  borderTop: `1px dashed ${rgba(THEME.color.ivory, 0.35)}`,
                }}
              />
              {/* вода */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: `${level * 100}%`,
                  background: `linear-gradient(to bottom, ${rgba(acc, 0.42)}, ${rgba(acc, 0.72)})`,
                  transform: `translateY(${wave * 0.4}px)`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: -10,
                    right: -10,
                    top: -6,
                    height: 12,
                    borderRadius: '50%',
                    background: rgba('#ffffff', 0.5),
                    filter: 'blur(3px)',
                    transform: `translateY(${wave}px)`,
                  }}
                />
              </div>
            </div>

            {/* значение */}
            <div style={{paddingBottom: 6}}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 76,
                    fontWeight: 600,
                    lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    color: THEME.color.paper,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {shown.toFixed(decimals)}
                </span>
                <span style={{fontFamily: MONO, fontSize: 20, letterSpacing: '0.16em', color: acc}}>{unit}</span>
              </div>
              {note ? (
                <div
                  style={{
                    marginTop: 16,
                    fontFamily: THEME.font.sans,
                    fontSize: 15,
                    lineHeight: 1.4,
                    color: THEME.color.graphite,
                    maxWidth: 200,
                    opacity: interpolate(drop, [0.5, 1], [0, 1], clamp),
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