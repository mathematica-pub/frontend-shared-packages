import {
  AxisConfig,
  BarsComponent,
  BarsConfig,
  CategoricalColorDimension,
  DimensionProperties,
  LabelsConfig,
  LinesConfig,
  OrdinalDimension,
  QuantitativeDimension,
  TooltipConfig,
  verticalBarChartDimensionsConfig,
} from '../src/public-api';
import { NestedConfig, SampleConfig } from './sampleConfig.model';

var config = new AxisConfig({
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

var configother = new BarsConfig({
  ordinal: new OrdinalDimension(),
  quantitative: new QuantitativeDimension(),
  category: new CategoricalColorDimension(),
  dimensions: verticalBarChartDimensionsConfig,
  labels: new LabelsConfig(),
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
