import {
  AxisConfig,
  BarsConfig,
  BarsLabelsConfig,
  CategoricalColorDimensionConfig,
  OrdinalDimensionConfig,
  QuantitativeDimensionConfig,
  TooltipConfig,
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

const configother = new BarsConfig({
  ordinal: new OrdinalDimensionConfig(),
  quantitative: new QuantitativeDimensionConfig(),
  category: new CategoricalColorDimensionConfig(),
  dimensions: verticalBarChartDimensionsConfig,
  labels: new BarsLabelsConfig(),
  // whoa hello there testing
  positivePaddingForAllNegativeValues: 0.2,
  // data: any[],
  mixBlendMode: 'normal',
  tooltip: new TooltipConfig(),
  // more test comments!
  //ordinal.valueAccessor: (d, i) => i,
  //quantitative.valueAccessor: (d) => d,
  //quantitative.scaleType: scaleLinear,
  //category.valueAccessor: (d) => d,
  //category.colors: ['lightslategray'],
});
