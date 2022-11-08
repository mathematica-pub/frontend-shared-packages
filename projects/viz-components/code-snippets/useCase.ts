import {
  AxisConfig,
  BarsConfig,
  BarsLabelsConfig,
  OrdinalDimensionConfig,
  QuantitativeDimensionConfig,
  verticalBarChartDimensionsConfig,
} from '../src/public-api';

const config = new AxisConfig({
  // numTicks: number | TimeInterval,
  // tickFormat: string,
  // tickValues: any[],
  // removeDomain: boolean,
  // removeTicks: boolean,
  // removeTickMarks: boolean,
  // showGridLines: boolean,
  // wrap: TickWrap,
  // tickSizeOuter: number,
  // tickLabelFontSize: number,
});

new BarsConfig({
  ordinal: new OrdinalDimensionConfig(),
  quantitative: new QuantitativeDimensionConfig(),
  // category: CategoricalColorDimensionConfig
  dimensions: verticalBarChartDimensionsConfig,
  labels: new BarsLabelsConfig(),
  positivePaddingForAllNegativeValues: 0.2,
  // data: any[],
  mixBlendMode: 'normal',
  //ordinal.valueAccessor: (d, i) => i,
  //quantitative.valueAccessor: (d) => d,
  //quantitative.scaleType: scaleLinear,
  //category.valueAccessor: (d) => d,
  //category.colors: ['lightslategray'],
});
