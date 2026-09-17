import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {WhisperWord} from '../types';
import type {OverlaySpec} from './overlayTypes';

import {StatisticOverlay} from './StatisticOverlay';
import {LocationOverlay} from './LocationOverlay';
import {DateOverlay} from './DateOverlay';
import {TimelineOverlay} from './TimelineOverlay';
import {SpeciesOverlay} from './SpeciesOverlay';
import {PopulationOverlay} from './PopulationOverlay';
import {BeforeAfterOverlay} from './BeforeAfterOverlay';
import {CounterOverlay} from './CounterOverlay';
import {RouteOverlay} from './RouteOverlay';
import {AreaOverlay} from './AreaOverlay';
import {TemperatureOverlay} from './TemperatureOverlay';
import {WaterLevelOverlay} from './WaterLevelOverlay';
import {ComparisonOverlay} from './ComparisonOverlay';
import {CauseEffectOverlay} from './CauseEffectOverlay';
import {QuoteOverlay} from './QuoteOverlay';
import {PersonOverlay} from './PersonOverlay';
import {OrganizationOverlay} from './OrganizationOverlay';
import {ProcessOverlay} from './ProcessOverlay';
import {RestorationOverlay} from './RestorationOverlay';
import {SpeciesReturnOverlay} from './SpeciesReturnOverlay';
import {GraphOverlay} from './GraphOverlay';
import {BarChartOverlay} from './BarChartOverlay';
import {LineChartOverlay} from './LineChartOverlay';

const renderOne = (spec: OverlaySpec, key: React.Key) => {
  switch (spec.kind) {
    case 'statistic':
      return <StatisticOverlay key={key} {...spec} />;
    case 'location':
      return <LocationOverlay key={key} {...spec} />;
    case 'date':
      return <DateOverlay key={key} {...spec} />;
    case 'timeline':
      return <TimelineOverlay key={key} {...spec} />;
    case 'species':
      return <SpeciesOverlay key={key} {...spec} />;
    case 'population':
      return <PopulationOverlay key={key} {...spec} />;
    case 'before_after':
      return <BeforeAfterOverlay key={key} {...spec} />;
    case 'counter':
      return <CounterOverlay key={key} {...spec} />;
    case 'route':
      return <RouteOverlay key={key} {...spec} />;
    case 'area':
      return <AreaOverlay key={key} {...spec} />;
    case 'temperature':
      return <TemperatureOverlay key={key} {...spec} />;
    case 'water_level':
      return <WaterLevelOverlay key={key} {...spec} />;
    case 'comparison':
      return <ComparisonOverlay key={key} {...spec} />;
    case 'cause_effect':
      return <CauseEffectOverlay key={key} {...spec} />;
    case 'quote':
      return <QuoteOverlay key={key} {...spec} />;
    case 'person':
      return <PersonOverlay key={key} {...spec} />;
    case 'organization':
      return <OrganizationOverlay key={key} {...spec} />;
    case 'process':
      return <ProcessOverlay key={key} {...spec} />;
    case 'restoration':
      return <RestorationOverlay key={key} {...spec} />;
    case 'species_return':
      return <SpeciesReturnOverlay key={key} {...spec} />;
    case 'graph':
      return <GraphOverlay key={key} {...spec} />;
    case 'bar_chart':
      return <BarChartOverlay key={key} {...spec} />;
    case 'line_chart':
      return <LineChartOverlay key={key} {...spec} />;
    default: {
      // исчерпывающая проверка: новый kind без ветки — ошибка компиляции
      const never: never = spec;
      return never;
    }
  }
};

export interface OverlayRendererProps {
  overlays?: OverlaySpec[];
  /** Пробрасывается во все оверлеи, у которых нет своих whisperWords. */
  whisperWords?: WhisperWord[];
}

/**
 * Кладётся поверх содержимого сцены внутри <Sequence>:
 * каждый оверлей сам берёт durationInFrames секвенции для зеркального ухода.
 */
export const OverlayRenderer: React.FC<OverlayRendererProps> = ({overlays, whisperWords}) => {
  if (!overlays?.length) return null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {overlays.map((o, i) => renderOne({...o, whisperWords: o.whisperWords ?? whisperWords} as OverlaySpec, i))}
    </AbsoluteFill>
  );
};