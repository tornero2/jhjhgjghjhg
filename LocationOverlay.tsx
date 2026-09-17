import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, useMaterialize, useTriggerFrame} from './_core';
import type {LocationOverlayProps} from './overlayTypes';

/** LOCATION — «The project began in the forests of Oregon.» */
export const LocationOverlay: React.FC<LocationOverlayProps> = ({
  place,
  region,
  coords,
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

  const shell = useMaterialize({delay: at, from: 'top', shift: 22, blur: 18, scale: 0.97});
  const pulse = 0.5 + 0.5 * Math.sin(((frame - at) / fps) * Math.PI * 1.4);

  return (
    <>
      {wash ? <EdgeWash side="top" delay={at - 4} size={360} blur={20} tint={0.3} /> : null}

      <div style={{position: 'absolute', [side]: 120, top: 110, ...shell.style}}>
        <Glass pad="18px 26px 18px 22px" radius={999} strength={18}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            {/* пин с расходящимся кольцом */}
            <div style={{position: 'relative', width: 16, height: 16, flexShrink: 0}}>
              <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: acc}} />
              <div
                style={{
                  position: 'absolute',
                  inset: -4 - pulse * 12,
                  borderRadius: '50%',
                  border: `1px solid ${rgba(acc, Math.max(0, 0.65 - pulse * 0.6))}`,
                }}
              />
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
              <div
                style={{
                  fontFamily: THEME.font.sans,
                  fontSize: 27,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: THEME.color.paper,
                  lineHeight: 1,
                }}
              >
                {place}
                {region ? <span style={{color: THEME.color.graphite}}>, {region}</span> : null}
              </div>
              {coords ? (
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: THEME.track.micro,
                    color: THEME.color.graphite,
                  }}
                >
                  {coords}
                </div>
              ) : null}
            </div>
          </div>
        </Glass>
      </div>
    </>
  );
};