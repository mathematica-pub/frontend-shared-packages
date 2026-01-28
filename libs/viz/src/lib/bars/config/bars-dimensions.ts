export interface BarsDimensions {
  x: 'ordinal' | 'quantitative';
  y: 'ordinal' | 'quantitative';
  ordinal: 'x' | 'y';
  quantitative: 'x' | 'y';
  quantitativeDimension: 'width' | 'height';
  isHorizontal: boolean;
  isVertical: boolean;
}

export const HORIZONTAL_BARS_DIMENSIONS: BarsDimensions = {
  x: 'quantitative',
  y: 'ordinal',
  ordinal: 'y',
  quantitative: 'x',
  quantitativeDimension: 'width',
  isHorizontal: true,
  isVertical: false,
};

export const VERTICAL_BARS_DIMENSIONS: BarsDimensions = {
  x: 'ordinal',
  y: 'quantitative',
  ordinal: 'x',
  quantitative: 'y',
  quantitativeDimension: 'height',
  isHorizontal: false,
  isVertical: true,
};
