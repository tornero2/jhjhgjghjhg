import {useMemo} from 'react';
import {Easing} from 'remotion';

/**
 * Светлая «полевая» палитра: бумага, лён, мох, охра.
 * Ключи сохранены для совместимости с компонентами, но семантика инвертирована:
 *   void / slate / slateRaised — теперь светлые фоны (от глубокого к поднятому);
 *   ivory / paper              — теперь тёмный цвет текста и линий.
 */
export const THEME = {
  color: {
    void: '#efe9dc',        // самый глубокий фон — тёплая бумага
    slate: '#f4efe4',       // базовый фон сцены
    slateRaised: '#faf6ee', // поднятые поверхности, центр градиентов
    ash: '#d9d1c0',         // приглушённые плашки, «до» в сравнениях
    graphite: '#7a7466',    // вторичный текст
    ivory: '#2a2620',       // основной текст и линии (бывший светлый)
    paper: '#1f1b16',       // усиленный текст, акцентные заголовки
    ink: '#141210',         // максимальный контраст
    ochre: '#b8842e',       // акцент — чуть темнее, чтобы держался на светлом
    ochreDeep: '#8a6220',
    terracotta: '#a45a3f',
    olive: '#6f8a4a',       // живая зелень восстановления
    oliveDeep: '#4f6a34',
  },
  font: {
    serif: "Georgia, 'Times New Roman', 'Iowan Old Style', serif",
    sans: "'Helvetica Neue', Helvetica, 'Inter', Arial, sans-serif",
  },
  track: {
    micro: '0.34em',
    label: '0.22em',
    tight: '-0.035em',
  },
} as const;

/** Кинематографические кривые: без резинового ease-in-out по умолчанию. */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  marker: Easing.bezier(0.33, 0, 0.12, 1),
  draw: Easing.bezier(0.25, 0.1, 0.25, 1),
} as const;

export const SPRING_SOFT = {damping: 200, mass: 1.1, stiffness: 70} as const;
export const SPRING_PHYSICAL = {damping: 16, mass: 1.25, stiffness: 62} as const;

/** Уникальный id для SVG-фильтров и масок в пределах документа. */
export const useUid = (prefix: string): string =>
  useMemo(() => `${prefix}-${Math.random().toString(36).slice(2, 9)}`, [prefix]);

/** Тонкая типографская линейка. */
export const hairline = (color: string, opacity = 1): string =>
  `1px solid ${opacity === 1 ? color : rgba(color, opacity)}`;

export const rgba = (hex: string, alpha: number): string => {
  const v = hex.replace('#', '');
  const n = parseInt(
    v.length === 3
      ? v
          .split('')
          .map((c) => c + c)
          .join('')
      : v,
    16
  );
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};