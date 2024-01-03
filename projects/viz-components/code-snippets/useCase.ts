import {
  VicAxisConfig,
  VicBarsConfig,
  VicBarsLabelsConfig,
  VicOrdinalDimensionConfig,
  VicQuantitativeDimensionConfig,
  verticalBarChartDimensionsConfig,
} from '../src/public-api';

const config = new VicAxisConfig({
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

new VicBarsConfig({
  ordinal: new VicOrdinalDimensionConfig(),
  quantitative: new VicQuantitativeDimensionConfig(),
  // category: CategoricalColorDimensionConfig
  dimensions: verticalBarChartDimensionsConfig,
  labels: new VicBarsLabelsConfig(),
  // data: any[],
  mixBlendMode: 'normal',
  //ordinal.valueAccessor: (d, i) => i,
  //quantitative.valueAccessor: (d) => d,
  //quantitative.scaleType: scaleLinear,
  //category.valueAccessor: (d) => d,
  //category.colors: ['lightslategray'],
});
