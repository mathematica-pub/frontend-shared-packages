export interface QuantitativeRulesDimensions {
  quantitative: 'x' | 'y';
  quantitativeDimension: 'width' | 'height';
  isHorizontal: boolean;
  isVertical: boolean;
}

export const HORIZONTAL_RULE_DIMENSIONS: QuantitativeRulesDimensions = {
  quantitative: 'x',
  quantitativeDimension: 'width',
  isHorizontal: true,
  isVertical: false,
};

export const VERTICAL_RULE_DIMENSIONS: QuantitativeRulesDimensions = {
  quantitative: 'y',
  quantitativeDimension: 'height',
  isHorizontal: false,
  isVertical: true,
};
