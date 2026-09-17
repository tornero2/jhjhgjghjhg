import type {WhisperWord} from '../types';

export type OverlayKind =
  | 'statistic' | 'location' | 'date' | 'timeline' | 'species'
  | 'population' | 'before_after' | 'counter'
  // ── батч 2/3 ──
  | 'route' | 'area' | 'temperature' | 'water_level' | 'comparison'
  | 'cause_effect' | 'quote' | 'person' | 'organization'
  | 'process' | 'restoration' | 'species_return'
  | 'graph' | 'bar_chart' | 'line_chart';

export type OverlayAccent = 'ochre' | 'terracotta' | 'olive';
export type OverlaySide = 'left' | 'right';

export interface OverlayBase {
  /** Задержка появления в кадрах от начала сцены. */
  delay?: number;
  side?: OverlaySide;
  accent?: OverlayAccent;
  /** Боковой блюр-уош под оверлеем. */
  wash?: boolean;
  /** Привязка к слову в озвучке вместо фиксированной задержки. */
  whisperWords?: WhisperWord[];
  triggerPhrase?: string | null;
  triggerOccurrence?: number;
}

export interface StatisticOverlayProps extends OverlayBase {
  value: number;
  unit?: string;
  decimals?: number;
  label: string;
  context?: string;
}

export interface LocationOverlayProps extends OverlayBase {
  place: string;
  region?: string;
  coords?: string;
}

export interface DateOverlayProps extends OverlayBase {
  year: string;
  label?: string;
  context?: string;
}

export interface TimelineEvent {
  year: string;
  label?: string;
}

export interface TimelineOverlayProps extends OverlayBase {
  events: TimelineEvent[];
  title?: string;
}

export interface SpeciesOverlayProps extends OverlayBase {
  name: string;
  scientific?: string;
  status?: string;
  silhouette?: string;
}

export interface PopulationOverlayProps extends OverlayBase {
  label: string;
  value: number;
  unit?: string;
  /** Нормализованные точки 0..1 для спарклайна. */
  trend?: number[];
  note?: string;
}

export interface BeforeAfterOverlayProps extends OverlayBase {
  beforeLabel: string;
  afterLabel: string;
  caption?: string;
  startPosition?: number;
  endPosition?: number;
}

export interface CounterOverlayProps extends OverlayBase {
  to: number;
  from?: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
}