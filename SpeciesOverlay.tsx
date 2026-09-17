import React from 'react';
import {Img} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, useMaterialize, useTriggerFrame} from './_core';
import type {SpeciesOverlayProps} from './overlayTypes';

/** SPECIES — «Salmon once filled this river.» */
export const SpeciesOverlay: React.FC<SpeciesOverlayProps> = ({
  name,
  scientific,
  status,
  silhouette,
  delay = 8,
  side = 'left',
  accent = 'olive',
  wash = true,
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);

  const shell = useMaterialize({delay: at, from: side === 'left' ? 'left' : 'right', shift: 36, blur: 22});
  const art = useMaterialize({delay: at + 10, from: 'bottom', shift: 18, blur: 14, scale: 0.94});

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={760} blur={26} /> : null}

      <div style={{position: 'absolute', [side]: 120, bottom: 170, maxWidth: 640, ...shell.style}}>
        <Glass pad="30px 36px 32px" radius={24} strength={22}>
          {silhouette ? (
            <div style={{marginBottom: 22, ...art.style}}>
              <Img
                src={silhouette}
                style={{
                  width: 220,
                  height: 'auto',
                  display: 'block',
                  filter: `grayscale(1) contrast(1.15) opacity(0.88)`,
                  mixBlendMode: 'multiply',
                }}
              />
            </div>
          ) : null}

          <div
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: THEME.track.micro,
              textTransform: 'uppercase',
              color: acc,
              marginBottom: 12,
            }}
          >
            {status ?? 'Species'}
          </div>

          <div
            style={{
              fontFamily: THEME.font.sans,
              fontSize: 42,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: THEME.color.paper,
            }}
          >
            {name}
          </div>

          {scientific ? (
            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: `1px solid ${rgba(THEME.color.ivory, 0.13)}`,
                fontFamily: THEME.font.serif,
                fontStyle: 'italic',
                fontSize: 22,
                color: THEME.color.graphite,
              }}
            >
              {scientific}
            </div>
          ) : null}
        </Glass>
      </div>
    </>
  );
};