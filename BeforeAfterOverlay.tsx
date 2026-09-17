import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, THEME, rgba} from '../theme';
import {Glass, MONO, accentColor, clamp, useMaterialize, useTriggerFrame} from './_core';
import type {BeforeAfterOverlayProps} from './overlayTypes';

/**
 * BEFORE_AFTER — «Twenty years ago, this valley was almost completely bare.»
 * Оверлей рисует только раздел и метки: кадры отдаёт StillCompare под ним.
 */
export const BeforeAfterOverlay: React.FC<BeforeAfterOverlayProps> = ({
  beforeLabel,
  afterLabel,
  caption,
  startPosition = 0.5,
  endPosition = 0.5,
  delay = 6,
  accent = 'ochre',
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);

  const shell = useMaterialize({delay: at, from: 'center', shift: 0, blur: 16, scale: 0.99});
  const left = useMaterialize({delay: at + 8, from: 'left', shift: 26, blur: 14});
  const right = useMaterialize({delay: at + 14, from: 'right', shift: 26, blur: 14});

  const t = EASE.inOut(interpolate(frame, [at, durationInFrames - 20], [0, 1], clamp));
  const pos = interpolate(t, [0, 1], [startPosition, endPosition]);

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', ...shell.style}}>
      {/* раздел: не жёсткая линия, а мягкая кромка света */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${pos * 100}%`,
          width: 2,
          transform: 'translateX(-1px)',
          background: `linear-gradient(to bottom, ${rgba('#ffffff', 0)} 0%, ${rgba('#ffffff', 0.85)} 18%, ${rgba(
            '#ffffff',
            0.85
          )} 82%, ${rgba('#ffffff', 0)} 100%)`,
          boxShadow: `0 0 26px ${rgba(THEME.color.ink, 0.28)}`,
        }}
      />

      <div style={{position: 'absolute', left: 90, top: 110, ...left.style}}>
        <Glass pad="14px 22px" radius={999} strength={16}>
          <span style={{fontFamily: MONO, fontSize: 21, letterSpacing: '0.14em', color: THEME.color.graphite}}>
            {beforeLabel}
          </span>
        </Glass>
      </div>

      <div style={{position: 'absolute', right: 90, top: 110, ...right.style}}>
        <Glass pad="14px 22px" radius={999} strength={16}>
          <span style={{fontFamily: MONO, fontSize: 21, letterSpacing: '0.14em', color: acc, fontWeight: 600}}>
            {afterLabel}
          </span>
        </Glass>
      </div>

      {caption ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 140,
            transform: 'translateX(-50%)',
            textAlign: 'center',
            maxWidth: 820,
          }}
        >
          <Glass pad="18px 30px" radius={20} strength={20}>
            <span style={{fontFamily: THEME.font.serif, fontSize: 28, lineHeight: 1.3, color: THEME.color.paper}}>
              {caption}
            </span>
          </Glass>
        </div>
      ) : null}
    </div>
  );
};