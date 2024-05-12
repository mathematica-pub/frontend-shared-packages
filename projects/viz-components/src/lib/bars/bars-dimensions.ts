export interface VicBarsDimensions {
  direction: 'vertical' | 'horizontal';
  x: 'ordinal' | 'quantitative';
  y: 'ordinal' | 'quantitative';
  ordinal: 'x' | 'y';
  quantitative: 'x' | 'y';
  quantitativeDimension: 'width' | 'height';
}

export class VicHorizontalBarsDimensions implements VicBarsDimensions {
  direction: 'vertical' | 'horizontal' = 'horizontal';
  x: 'ordinal' | 'quantitative' = 'quantitative';
  y: 'ordinal' | 'quantitative' = 'ordinal';
  ordinal: 'x' | 'y' = 'y';
  quantitative: 'x' | 'y' = 'x';
  quantitativeDimension: 'width' | 'height' = 'width';
}

export class VicVerticalBarsDimensions implements VicBarsDimensions {
  direction: 'vertical' | 'horizontal' = 'vertical';
  x: 'ordinal' | 'quantitative' = 'ordinal';
  y: 'ordinal' | 'quantitative' = 'quantitative';
  ordinal: 'x' | 'y' = 'x';
  quantitative: 'x' | 'y' = 'y';
  quantitativeDimension: 'width' | 'height' = 'height';
}
