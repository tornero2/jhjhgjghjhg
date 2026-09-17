import React from 'react';
import {Composition, staticFile} from 'remotion';
import './newspaper/fonts';
import narration from './data/narration.json';
import sceneMap from './data/scenes.json';
import type {NarrationData} from './utils/whisperx';
import type {FilmProps, SceneMap} from './types';
import {OverlayGallery, OVERLAY_SAMPLES, SLOT} from './compositions/OverlayGallery';
import {RewildingFilm, resolveScenes} from './compositions/RewildingFilm';
import {DynamicSubtitles} from './components/DynamicSubtitles';
import {UsaMap} from './components/UsaMap';
import {NewspaperModern, newspaperModernDefaults} from './newspaper/NewspaperModern';
import {NewspaperVintage, newspaperVintageDefaults} from './newspaper/NewspaperVintage';
import {NewspaperSpin, newspaperSpinDefaults} from './newspaper/NewspaperSpin';
import {THEME} from './theme';

const NARRATION = narration as unknown as NarrationData;
const MAP = sceneMap as unknown as SceneMap;
const FPS = NARRATION.fps;

const SCENES = resolveScenes(MAP, NARRATION.words, NARRATION.durationInFrames);

const FILM: FilmProps = {
  whisperWords: NARRATION.words,
  audioSrc: staticFile('audio/narration.wav'),
  scenes: SCENES,
  totalFrames: NARRATION.durationInFrames,
  subtitles: {
    position: 'bottom',
    fontSize: 56,
    maxWordsPerLine: 5,
    maxCharsPerLine: 38,
    activeColor: THEME.color.ivory,
  },
};

export const RemotionRoot: React.FC = () => (
  <>
    {/* ─── Основной фильм ─── */}
    <Composition
      id="RewildingFilm"
      component={RewildingFilm}
      durationInFrames={NARRATION.durationInFrames}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={FILM}
    />

<Composition
  id="Layer-Overlays"
  component={OverlayGallery}
  durationInFrames={OVERLAY_SAMPLES.length * SLOT}
  fps={FPS}
  width={1920}
  height={1080}
  defaultProps={{whisperWords: []}}
/>

    {/* ─── Изолированные субтитры ─── */}
    <Composition
      id="Layer-Subtitles"
      component={DynamicSubtitles}
      durationInFrames={NARRATION.durationInFrames}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        ...FILM.subtitles,
        whisperWords: NARRATION.words,
        frameOffset: 0,
      }}
    />

    {/* ─── Композиция карты США (для тестирования) ─── */}
    <Composition
      id="Layer-UsaMap"
      component={UsaMap}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
      defaultProps={{
        region: 'southwest',
        focusStates: ['New Mexico'],
        markers: [
          {
            lon: -106.89,
            lat: 33.79,
            label: 'Socorro County',
            sublabel: 'Рио-Гранде',
          },
        ],
        facts: [
          {value: '1 800 км', label: 'восстановлено русел'},
          {value: '−41 %', label: 'пиковый сток'},
        ],
        tags: ['rewilding', 'гидрология', 'low-tech'],
        whisperWords: NARRATION.words,
        frameOffset: 0,
      }}
    />

    {/* ─── Газетные композиции ─── */}
    <Composition
      id="NewspaperModern"
      component={NewspaperModern}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={240}
      defaultProps={newspaperModernDefaults}
    />

    <Composition
      id="NewspaperVintage"
      component={NewspaperVintage}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
      defaultProps={newspaperVintageDefaults}
    />

    <Composition
      id="NewspaperSpin"
      component={NewspaperSpin}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={240}
      defaultProps={newspaperSpinDefaults}
    />
  </>
);