import React from 'react';
import {Img} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, useMaterialize, useTriggerFrame} from './_core';
import type {OrganizationOverlayProps} from './overlayTypes';

/** ORGANIZATION — «The Nature Conservancy joined the project in 2008.» */
export const OrganizationOverlay: React.FC<OrganizationOverlayProps> = ({
  name,
  caption,
  since,
  logo,
  delay = 6,
  side = 'right',
  accent = 'ochre',
  wash = false,
  whisperWords,
  triggerPhrase,
  triggerOccurrence = 0,
}) => {
  const trigger = useTriggerFrame(whisperWords, triggerPhrase, triggerOccurrence);
  const at = trigger ? trigger + delay : delay;
  const acc = accentColor(accent);

  const shell = useMaterialize({delay: at, from: side === 'left' ? 'left' : 'right', shift: 26, blur: 18, scale: 0.98});
  const mark = useMaterialize({delay: at + 8, from: 'center', shift: 0, blur: 12, scale: 0.86});

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={560} blur={20} tint={0.26} /> : null}

      <div style={{position: 'absolute', [side]: 120, bottom: 160, maxWidth: 620, ...shell.style}}>
        <Glass pad="20px 30px" radius={18} strength={18}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            {logo ? (
              <div style={{width: 52, height: 52, flexShrink: 0, ...mark.style}}>
                <Img
                  src={logo}
                  style={{width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply'}}
                />
              </div>
            ) : (
              <div
                style={{
                  width: 4,
                  alignSelf: 'stretch',
                  borderRadius: 2,
                  background: acc,
                  flexShrink: 0,
                }}
              />
            )}

            <div style={{display: 'flex', flexDirection: 'column', gap: 7}}>
              <div
                style={{
                  fontFamily: THEME.font.sans,
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                  color: THEME.color.paper,
                }}
              >
                {name}
              </div>
              {caption || since ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: THEME.track.micro,
                    textTransform: 'uppercase',
                    color: THEME.color.graphite,
                  }}
                >
                  {caption ? <span>{caption}</span> : null}
                  {caption && since ? (
                    <span style={{width: 1, height: 11, background: rgba(THEME.color.ivory, 0.22)}} />
                  ) : null}
                  {since ? <span style={{color: acc}}>{since}</span> : null}
                </div>
              ) : null}
            </div>
          </div>
        </Glass>
      </div>
    </>
  );
};