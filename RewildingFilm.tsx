import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {
  FilmProps,
  ResolvedScene,
  SceneContentCompare,
  SceneContentMetric,
  SceneContentNewsprint,
  SceneContentStill,
  SceneContentTopo,
  SceneContentStat,
  SceneMap,
  WhisperWord,
} from '../types';
import {EASE, THEME} from '../theme';
import {CinematicNewsprint} from '../components/CinematicNewsprint';
import {HeavyMetricCounter} from '../components/HeavyMetricCounter';
import {UsaMap} from '../components/UsaMap';
import {CinematicStill} from '../components/CinematicStill';
import {StillCompare} from '../components/StillCompare';
import {StatVisual} from '../components/StatVisual';
import {DynamicSubtitles} from '../components/DynamicSubtitles';
import {FilmGrain} from '../components/FilmGrain';
import {OverlayRenderer, Scrim} from '../overlays';

const PREROLL = 14;
const OVERLAP = 18;
const MIN_SCENE = 40;
const IMAGES_DIR = 'images/';

/** Допустимые типы сцен — всё остальное приходит из LLM по ошибке. */
const SCENE_KEYS = ['still', 'newsprint', 'metric', 'topo', 'compare', 'stat'] as const;

/**
 * Нормализация слова: WhisperX отдаёт токены с пунктуацией («Bowl.», «desert,»),
 * а триггеры в разметке — без. Без этого совпадений почти не будет.
 */
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/**
 * Привязывает сцены из LLM-разметки к кадрам WhisperX.
 * Сцена живёт до старта следующей плюс перекрытие.
 */
export const resolveScenes = (
  map: SceneMap,
  words: WhisperWord[],
  total: number
): ResolvedScene[] => {
  const starts = map.scenes.map((scene, index) => {
    if (!scene.triggerPhrase) return 0;

    const target = scene.triggerPhrase.split(/\s+/).map(norm).filter(Boolean);
    if (!target.length) return 0;

    let hit = 0;
    for (let i = 0; i + target.length <= words.length; i++) {
      let ok = true;
      for (let j = 0; j < target.length; j++) {
        if (norm(words[i + j].word) !== target[j]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        if (hit === (scene.occurrenceIndex ?? 0)) {
          return Math.max(0, words[i].startFrame - PREROLL);
        }
        hit++;
      }
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[scene ${index}] триггер «${scene.triggerPhrase}» не найден в озвучке — равномерный фолбек`
    );
    return Math.round((total / map.scenes.length) * index);
  });

  // Коррекция пересечений: каждая следующая сцена стартует позже предыдущей
  for (let i = 1; i < starts.length; i++) {
    if (starts[i] <= starts[i - 1]) {
      starts[i] = starts[i - 1] + MIN_SCENE;
    }
  }

  return map.scenes.map((scene, index) => {
    if (!SCENE_KEYS.includes(scene.key as (typeof SCENE_KEYS)[number])) {
      // eslint-disable-next-line no-console
      console.error(
        `[scene ${index}] key «${scene.key}» не является типом сцены. ` +
          `Допустимы: ${SCENE_KEYS.join(', ')}. ` +
          `Похоже, это оверлей — его место в массиве overlays.`
      );
    }

    const from = Math.min(starts[index], Math.max(total - MIN_SCENE, 0));
    const next = index + 1 < starts.length ? starts[index + 1] : total;
    return {
      ...scene,
      from,
      durationInFrames: Math.max(next - from + OVERLAP, MIN_SCENE),
    };
  });
};

/**
 * Оболочка сцены: вход из расфокуса, зеркальный уход.
 */
const SceneShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {damping: 200, mass: 1.2},
    durationInFrames: 24,
  });
  const exit = interpolate(frame, [durationInFrames - 20, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.inOut,
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${
          interpolate(enter, [0, 1], [1.035, 1]) * interpolate(exit, [0, 1], [1, 0.988])
        })`,
        filter: `blur(${interpolate(enter, [0, 1], [10, 0]) + exit * 9}px)`,
        opacity: Math.min(enter, 1 - exit),
        backgroundColor: THEME.color.void,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Диспетчер: по key выбирает компонент и раскладывает content в пропсы.
 */
const SceneRenderer: React.FC<{
  scene: ResolvedScene;
  words: WhisperWord[];
  hasStage: boolean;
}> = ({scene, words, hasStage}) => {
  switch (scene.key) {
    case 'still': {
      const c = scene.content as SceneContentStill;
      return (
        <CinematicStill
          file={c.file ? IMAGES_DIR + c.file : undefined}
          // При stage-оверлее подпись кадра выключается, иначе два текста дерутся
          caption={hasStage ? null : c.caption}
          captionSub={hasStage ? null : c.captionSub}
          motion={c.motion}
          seed={scene.index + 1}
          frameOffset={scene.from}
        />
      );
    }

    case 'newsprint': {
      const c = scene.content as SceneContentNewsprint;
      const auto = (['modern', 'vintage', 'spin'] as const)[scene.index % 3];
      return (
        <CinematicNewsprint
          variant={c.variant ?? auto}
          masthead="THE RESTORATION RECORD"
          edition={`No. ${String(scene.index + 1).padStart(2, '0')}`}
          dateline="Field Dispatch"
          headline={c.headline}
          standfirst={c.standfirst}
          columns={c.columns}
          highlights={c.highlights}
          photos={c.photos}
          photoCaptions={c.photoCaptions}
          whisperWords={words}
          frameOffset={scene.from}
        />
      );
    }

    case 'metric': {
      const c = scene.content as SceneContentMetric;
      return (
        <HeavyMetricCounter
          whisperWords={words}
          frameOffset={scene.from}
          triggerPhrase={scene.triggerPhrase ?? undefined}
          triggerOccurrence={scene.occurrenceIndex ?? 0}
          value={c.value}
          suffix={c.suffix}
          label={c.label}
          context={c.context}
          align="left"
          accent={THEME.color.ochre}
        />
      );
    }

    case 'topo': {
      const c = scene.content as SceneContentTopo;
      return (
        <UsaMap
          whisperWords={words}
          frameOffset={scene.from}
          triggerPhrase={scene.triggerPhrase ?? undefined}
          triggerOccurrence={scene.occurrenceIndex ?? 0}
          region={c.region}
          focusStates={c.focusStates}
          eyebrow={c.eyebrow}
          title={c.title}
          subtitle={c.subtitle}
          markers={c.markers}
          facts={c.facts}
          tags={c.tags}
        />
      );
    }

    case 'compare': {
      const c = scene.content as SceneContentCompare;
      return (
        <StillCompare
          before={{
            file: c.before.file ? IMAGES_DIR + c.before.file : undefined,
            label: c.before.label,
            caption: c.before.caption,
          }}
          after={{
            file: c.after.file ? IMAGES_DIR + c.after.file : undefined,
            label: c.after.label,
            caption: c.after.caption,
          }}
          frameOffset={scene.from}
        />
      );
    }

    case 'stat': {
      const c = scene.content as SceneContentStat;
      return (
        <StatVisual
          type={c.type}
          mode={c.mode}
          icon={c.icon}
          count={c.count}
          label={c.label}
          subtitle={c.subtitle}
          unit={c.unit}
          accent={c.accent}
          durationInFrames={scene.durationInFrames}
        />
      );
    }

    default: {
      // eslint-disable-next-line no-console
      console.error(
        `[scene ${scene.index}] неизвестный key «${scene.key}» — сцена пустая. ` +
          `Допустимы: ${SCENE_KEYS.join(', ')}.`
      );
      return null;
    }
  }
};

/**
 * Главный фильм: сцены + оверлеи + субтитры + зерно.
 */
export const RewildingFilm: React.FC<FilmProps> = ({
  whisperWords,
  audioSrc,
  scenes,
  totalFrames,
  subtitles,
}) => (
  <AbsoluteFill style={{backgroundColor: THEME.color.void}}>
    {audioSrc ? <Audio src={audioSrc} /> : null}

    {scenes.map((scene) => {
      // Stage-оверлеи забирают кадр целиком: фон уходит назад, подпись гасится
      const stage = scene.overlays?.find(
        (o) => o.kind === 'quote' || o.kind === 'before_after' || o.kind === 'cause_effect'
      );

      return (
        <Sequence
          key={`${scene.index}-${scene.key}`}
          from={scene.from}
          durationInFrames={scene.durationInFrames}
        >
          <SceneShell>
            <SceneRenderer scene={scene} words={whisperWords} hasStage={Boolean(stage)} />

            {/* Вуаль под stage-контент — со стороны, где он живёт */}
            {stage ? (
              <Scrim
                side={(stage as {side?: 'left' | 'right'}).side ?? 'left'}
                delay={0}
                blur={20}
                veil={0.72}
              />
            ) : null}

            <OverlayRenderer overlays={scene.overlays} whisperWords={whisperWords} />
          </SceneShell>
        </Sequence>
      );
    })}

    <Sequence from={0} durationInFrames={totalFrames}>
      <DynamicSubtitles
        {...(subtitles ?? {})}
        whisperWords={whisperWords}
        frameOffset={0}
        position="bottom"
        fontSize={56}
        maxWordsPerLine={5}
        maxCharsPerLine={38}
      />
    </Sequence>

    <FilmGrain opacity={0.08} />
  </AbsoluteFill>
);