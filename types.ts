import type {UsaRegionId} from './map/usaRegions';
import type {OverlaySpec} from './overlays/overlayTypes';

/* ────────────────────────── WHISPERX ──────────────────────────────── */

export interface WhisperWord {
  word: string;
  startFrame: number;
  endFrame: number;
  score?: number;
}

export interface FrameRange {
  start: number;
  end: number;
}

export interface NarrationData {
  fps: number;
  durationInFrames: number;
  audioDurationInSeconds: number;
  language: string;
  offsetFrames: number;
  words: WhisperWord[];
  transcript: string;
}

/* ──────────────────────── ДИНАМИЧЕСКИЕ СУБТИТРЫ ──────────────────── */

export interface DynamicSubtitlesProps {
  position?: 'top' | 'bottom';
  fontSize?: number;
  maxWordsPerLine?: number;
  maxCharsPerLine?: number;
  maxGapFrames?: number;
  activeColor?: string;
  idleColor?: string;
  leadIn?: number;
  holdOut?: number;
  whisperWords: WhisperWord[];
  frameOffset?: number;
}

/* ────────────────────────── ГАЗЕТНАЯ ПОЛОСА ───────────────────────── */

export interface NewsprintColumn {
  kicker?: string;
  paragraphs: string[];
}

export type NewspaperVariant = 'modern' | 'vintage' | 'spin';

export type NewsprintMarkerColor = 'ochre' | 'terracotta';

export interface NewsprintHighlight {
  phrase: string;
  color: NewsprintMarkerColor;
  occurrence?: number;
}

export interface CinematicNewsprintProps {
  variant?: NewspaperVariant;
  masthead: string;
  edition: string;
  dateline: string;
  headline: string;
  standfirst?: string;
  columns: NewsprintColumn[];
  highlights?: NewsprintHighlight[];
  whisperWords: WhisperWord[];
  frameOffset?: number;
  photos?: string[];
  photoCaptions?: string[];
  volume?: string;
  price?: string;
}

/* ────────────────────── КРУПНЫЕ ЦИФРЫ (МЕТРИКА) ──────────────────── */

export interface HeavyMetricCounterProps {
  value: number;
  suffix?: string;
  label: string;
  context?: string;
  align?: 'left' | 'center';
  accent?: string;
  whisperWords: WhisperWord[];
  frameOffset?: number;
  triggerPhrase?: string;
  triggerOccurrence?: number;
  decimals?: number;
}

/* ──────────────────────── USA MAP КОМПОНЕНТ ──────────────────────── */

export interface UsaMapMarker {
  lon: number;
  lat: number;
  label: string;
  sublabel?: string;
}

export interface UsaMapFact {
  label: string;
  value: string;
}

export interface UsaMapProps {
  focusStates?: string[];
  region?: UsaRegionId;
  markers?: UsaMapMarker[];
  facts?: UsaMapFact[];
  tags?: string[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  zoomPadding?: number;
  sweepFrames?: number;
  drawDuration?: number;
  zoomDelay?: number;
  zoomDuration?: number;
  whisperWords?: WhisperWord[];
  triggerPhrase?: string;
  triggerOccurrence?: number;
  frameOffset?: number;
}

/* ──────────────────────── ЛОКАЛЬНЫЕ КАДРЫ (STILL) ──────────────────── */

export type StillMotion = 'slow-push-in' | 'slow-pull-out' | 'drift-left' | 'drift-right' | 'static-hold';

export interface CinematicStillProps {
  file?: string;
  caption?: string | null;
  captionSub?: string | null;
  motion?: StillMotion;
  seed?: number;
  frameOffset?: number;
}

/* ──────────────────────── СЛАЙДЕР ДО/ПОСЛЕ ──────────────────────── */

export interface CompareSide {
  file?: string;
  label: string;
  caption?: string | null;
}

export interface StillCompareProps {
  before: CompareSide;
  after: CompareSide;
  startPosition?: number;
  endPosition?: number;
  frameOffset?: number;
}

/* ────────────────────────── ВИЗУАЛЬНАЯ СТАТИСТИКА ──────────────────── */

export type IconName =
  // ДЕРЕВЬЯ И РАСТЕНИЯ
  | 'tree'
  | 'treePine'
  | 'treePalm'
  | 'trees'
  | 'forest'
  | 'sprout'
  | 'leaf'
  | 'leaf2'
  | 'leaf3'
  | 'leaf4'
  | 'leafy'
  | 'leaves'
  | 'clover'
  | 'fern'
  | 'hemp'
  | 'flower'
  | 'lotus'
  | 'flowerTulip'
  | 'moss'
  | 'shrub'
  | 'cactus'
  | 'seaweed'
  | 'vine'
  | 'seed'
  // ВОДА И КЛИМАТ
  | 'water'
  | 'waves'
  | 'droplet'
  | 'droplets'
  | 'raindrop'
  | 'waterdrop'
  | 'well'
  | 'spring'
  | 'river'
  | 'lake'
  | 'ocean'
  | 'island'
  | 'cloud'
  | 'cloudRain'
  | 'cloudSnow'
  | 'cloudDrizzle'
  | 'cloudLightning'
  | 'wind'
  | 'windTurbine'
  | 'cyclone'
  | 'tornado'
  | 'snow'
  | 'snowflake'
  | 'hail'
  | 'flood'
  // ПОЧВА И ЗЕМЛЯ
  | 'soil'
  | 'mountains'
  | 'hill'
  | 'mountain'
  | 'rock'
  | 'boulder'
  | 'sand'
  | 'desert'
  | 'shovel'
  | 'pickaxe'
  | 'trowel'
  // ЖИВОТНЫЕ
  | 'animal'
  | 'paw'
  | 'pawPrint'
  | 'bug'
  | 'insect'
  | 'bee'
  | 'butterfly'
  | 'moth'
  | 'ant'
  | 'spider'
  | 'scorpion'
  | 'caterpillar'
  | 'bird'
  | 'eagle'
  | 'feather'
  | 'nest'
  | 'duck'
  | 'penguin'
  | 'chicken'
  | 'fish'
  | 'shark'
  | 'whale'
  | 'octopus'
  | 'squid'
  | 'shrimp'
  | 'lobster'
  | 'crab'
  | 'jellyfish'
  | 'turtle'
  | 'lizard'
  | 'snake'
  | 'toad'
  | 'frog'
  | 'crocodile'
  | 'deer'
  | 'elk'
  | 'moose'
  | 'rabbit'
  | 'hare'
  | 'squirrel'
  | 'chipmunk'
  | 'badger'
  | 'otter'
  | 'beaver'
  | 'bear'
  | 'wolf'
  | 'fox'
  | 'raccoon'
  | 'hedgehog'
  | 'lion'
  | 'tiger'
  | 'leopard'
  | 'jaguar'
  | 'panther'
  | 'cheetah'
  | 'hyena'
  | 'elephant'
  | 'rhinoceros'
  | 'hippopotamus'
  | 'buffalo'
  | 'zebra'
  | 'giraffe'
  | 'antelope'
  | 'monkey'
  | 'ape'
  | 'gorilla'
  | 'chimpanzee'
  | 'horse'
  | 'donkey'
  | 'camel'
  | 'cow'
  | 'sheep'
  | 'goat'
  | 'pig'
  | 'llama'
  // ЛЮДИ И СООБЩЕСТВО
  | 'people'
  | 'users'
  | 'user'
  | 'userPlus'
  | 'userCheck'
  | 'users2'
  | 'person'
  | 'family'
  | 'child'
  | 'baby'
  | 'volunteer'
  | 'hands'
  | 'handshake'
  | 'heart'
  | 'smile'
  | 'activity'
  | 'community'
  | 'group'
  | 'crowd'
  | 'team'
  | 'cooperation'
  // СТРОЕНИЯ И ИНФРАСТРУКТУРА
  | 'house'
  | 'home'
  | 'house2'
  | 'building'
  | 'building2'
  | 'skyscraper'
  | 'tent'
  | 'cabin'
  | 'hut'
  | 'barn'
  | 'windmill'
  | 'lighthouse'
  | 'fence'
  | 'gate'
  | 'wall'
  | 'bridge'
  | 'road'
  | 'path'
  | 'trail'
  | 'park'
  | 'garden'
  | 'farm'
  | 'field'
  | 'orchard'
  | 'vineyard'
  // ЭНЕРГИЯ И ТЕХНОЛОГИЯ
  | 'sun'
  | 'solar'
  | 'battery'
  | 'power'
  | 'zap'
  | 'plug'
  | 'lightbulb'
  | 'windArrow'
  | 'turbine'
  | 'generator'
  | 'pump'
  | 'pipeline'
  | 'recycle'
  | 'refresh'
  | 'repeat'
  | 'rotateCcw'
  | 'cpu'
  | 'wrench'
  | 'hammer'
  | 'tool'
  | 'tools'
  // ПОЖАРНАЯ БЕЗОПАСНОСТЬ И МОНИТОРИНГ
  | 'flame'
  | 'fire'
  | 'alert'
  | 'alertTriangle'
  | 'alertCircle'
  | 'eye'
  | 'camera'
  | 'radar'
  | 'satellite'
  | 'binoculars'
  | 'search'
  | 'map'
  | 'mapPin'
  | 'compass'
  | 'navigation'
  // ОТХОДЫ И ЗАГРЯЗНЕНИЕ
  | 'trash'
  | 'trash2'
  | 'trash3'
  | 'trashBin'
  | 'dumpster'
  | 'package'
  | 'box'
  | 'container'
  | 'barrel'
  | 'bottle'
  | 'glass'
  | 'smoke'
  | 'pollution'
  | 'hazard'
  | 'biohazard'
  // РЕЗУЛЬТАТЫ И СТАТУС
  | 'check'
  | 'checkCircle'
  | 'checkCircle2'
  | 'checkmark'
  | 'x'
  | 'xCircle'
  | 'close'
  | 'trend'
  | 'trendingUp'
  | 'trendingDown'
  | 'barChart'
  | 'lineChart'
  | 'growth'
  | 'increase'
  | 'decrease'
  | 'shield'
  | 'shieldCheck'
  | 'award'
  | 'trophy'
  | 'medal'
  | 'star'
  | 'thumbsUp'
  | 'thumbsDown'
  // РАЗНОЕ
  | 'globe'
  | 'globe2'
  | 'world'
  | 'earth'
  | 'planet'
  | 'moon'
  | 'stars'
  | 'comet'
  | 'radiation'
  | 'hourglass'
  | 'clock'
  | 'calendar'
  | 'timer'
  | 'book'
  | 'document'
  | 'clipboard'
  | 'note'
  | 'notebook'
  | 'microscope'
  | 'testTube'
  | 'beaker'
  | 'flask'
  | 'dna'
  | 'atom'
  | 'bolt';

export type StatVisualMode = 'grid' | 'counter' | 'bar';

export type StatAccent = 'ochre' | 'terracotta' | 'olive';

export interface SceneContentStat {
  type: 'stat';
  mode: StatVisualMode;
  icon: IconName;
  count: number;
  label: string;
  subtitle?: string;
  unit?: string;
  accent?: StatAccent;
}

export interface StatVisualProps extends SceneContentStat {
  durationInFrames: number;
}

/* ────────────────────────── СЦЕНА ИЗ LLM ──────────────────────────── */

export interface SceneContentStill {
  file?: string;
  imagePrompt?: string;
  caption?: string | null;
  captionSub?: string | null;
  motion?: StillMotion;
}

export interface SceneContentNewsprint {
  variant?: NewspaperVariant;
  headline: string;
  standfirst?: string;
  columns: NewsprintColumn[];
  highlights: NewsprintHighlight[];
  photos?: string[];
  photoCaptions?: string[];
}

export interface SceneContentMetric {
  value: number;
  suffix?: string;
  label: string;
  context?: string;
}

export interface SceneContentTopo {
  region?: UsaRegionId;
  focusStates?: string[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  markers?: UsaMapMarker[];
  facts?: UsaMapFact[];
  tags?: string[];
}

export interface SceneContentCompare {
  before: {file?: string; imagePrompt?: string; label: string; caption?: string | null};
  after: {file?: string; imagePrompt?: string; label: string; caption?: string | null};
}

export type SceneContent =
  | SceneContentStill
  | SceneContentNewsprint
  | SceneContentMetric
  | SceneContentTopo
  | SceneContentCompare
  | SceneContentStat;

export type SceneKey = 'still' | 'newsprint' | 'metric' | 'topo' | 'compare' | 'stat';

export interface SceneSpecJson {
  index: number;
  key: SceneKey;
  triggerPhrase: string | null;
  occurrenceIndex?: number;
  quotedContext?: string;
  coversText?: string;
  content: SceneContent;
  /** Слои поверх сцены; каждый может иметь свой triggerPhrase. */
  overlays?: OverlaySpec[];
  notes?: string;
}

export interface ImageManifestEntry {
  file: string;
  imagePrompt: string;
  sceneIndex: number;
}

export interface SceneMap {
  language: string;
  sourceCheck?: Record<string, unknown>;
  scenes: SceneSpecJson[];
  imageManifest?: ImageManifestEntry[];
  requiredTriggers?: string[];
  unresolved?: string[];
}

export interface ResolvedScene extends SceneSpecJson {
  from: number;
  durationInFrames: number;
}

/* ────────────────────────── ГЛАВНЫЙ ФИЛЬМ ──────────────────────────── */

export interface FilmProps {
  whisperWords: WhisperWord[];
  audioSrc?: string;
  scenes: ResolvedScene[];
  totalFrames: number;
  subtitles?: Omit<DynamicSubtitlesProps, 'whisperWords'>;
}