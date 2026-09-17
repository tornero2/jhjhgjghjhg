import React from 'react';
import {interpolate} from 'remotion';
import {THEME, rgba} from '../theme';
import {EdgeWash, Glass, MONO, accentColor, clamp, formatNumber, useCountUp, useMaterialize, useMomentum, useTriggerFrame} from './_core';
import type {SpeciesReturnOverlayProps} from './overlayTypes';

/** SPECIES_RETURN — «Five years after the dam was removed, salmon returned.» */
export const SpeciesReturnOverlay: React.FC<SpeciesReturnOverlayProps> = ({
  species,
  status = 'RETURNED',
  value,
  unit,
  year,
  note,
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

  const shell = useMaterialize({delay: at, from: 'bottom', shift: 30, blur: 22});
  // возвращение — событие с инерцией, здесь перелёт уместен
  const stamp = useMomentum(at + 10, 34);
  const shown = useCountUp(value ?? 0, {delay: at + 20, duration: 54});

  return (
    <>
      {wash ? <EdgeWash side={side} delay={at - 4} size={800} blur={26} /> : null}

      <div style={{position: 'absolute', [side]: 120, bottom: 170, ...shell.style}}>
        <Glass pad="30px 38px 32px" radius={24} strength={22}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20}}>
            <div
              style={{
                fontFamily: THEME.font.sans,
                fontSize: 40,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: THEME.color.paper,
                lineHeight: 1,
              }}
            >
              {species}
            </div>

            <div
              style={{
                padding: '9px 18px',
                borderRadius: 999,
                background: rgba(acc, 0.16),
                border: `1px solid ${rgba(acc, 0.42)}`,
                fontFamily: MONO,
                fontSize: 15,
                letterSpacing: '0.16em',
                color: acc,
                whiteSpace: 'nowrap',
                opacity: interpolate(stamp, [0, 0.35], [0, 1], clamp),
                transform: `scale(${interpolate(stamp, [0, 1], [0.7, 1], clamp)})`,
                transformOrigin: 'left center',
              }}
            >
              {status}
            </div>
          </div>

          {value !== undefined ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                paddingTop: 20,
                borderTop: `1px solid ${rgba(THEME.color.ivory, 0.13)}`,
              }}
            >
              <span style={{fontFamily: MONO, fontSize: 15, letterSpacing: '0.14em', color: THEME.color.graphite}}>0</span>
              <span style={{fontFamily: MONO, fontSize: 20, color: acc}}>→</span>
              <span
                style={{
                  fontFamily: THEME.font.serif,
                  fontSize: 92,
                  lineHeight: 0.88,
                  letterSpacing: '-0.05em',
                  color: THEME.color.paper,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatNumber(shown)}
              </span>
              {unit ? <span style={{fontFamily: MONO, fontSize: 18, letterSpacing: '0.16em', color: acc}}>{unit}</span> : null}
            </div>
          ) : null}

          {(year || note) && (
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'baseline',
                gap: 14,
                fontFamily: THEME.font.sans,
                fontSize: 16,
                lineHeight: 1.4,
                color: THEME.color.graphite,
                maxWidth: 460,
              }}
            >
              {year ? (
                <span style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.14em', color: THEME.color.ivory}}>{year}</span>
              ) : null}
              {note ? <span>{note}</span> : null}
            </div>
          )}
        </Glass>
      </div>
    </>
  );
};