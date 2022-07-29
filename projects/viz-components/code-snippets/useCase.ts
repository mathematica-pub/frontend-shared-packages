import { scaleLinear } from 'd3';
import {
  AxisConfig,
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

var myconfig = new SampleConfig({
  fieldA: 3.1,
  nestedConfig: new NestedConfig({
    // comment about field A
    nestedFieldA: 'hello I am a nested field',
    nestedFieldB: 'some more stuff exists here',
    //nestedFieldD: string
  }),
  nestedConfig2: new NestedConfig(),
});

var axisConfig = new AxisConfig({
  // numTicks?: number | TimeInterval,
  // tickFormat?: string,
  // tickValues?: any[],
  // removeDomain?: boolean,
  // removeTicks?: boolean,
  // removeTickMarks?: boolean,
  // showGridLines?: boolean,
  // wrap?: TickWrap,
  // tickSizeOuter?: number,
  // tickLabelFontSize?: number,
});

var barsConfig = new BarsConfig({
  ordinal: new OrdinalDimension({
    valueAccessor: (d, i) => i,
  }),
  quantitative: new QuantitativeDimension(),
  category: new CategoricalColorDimension({
    // override domain?: any[] | InternSet,
    // colorScale?: (...args: any) => any,
    // colors?: string[],
    // valueAccessor: (...args: any) => any,
    // domain?: any,
    // valueFormat?: string,
  }),
  dimensions: verticalBarChartDimensionsConfig,
  labels: new LabelsConfig({
    show: false,
    offset: 4,
    // color?: string,
    noValueString: 'N/A',
  }),
  positivePaddingForAllNegativeValues: 0.2,
  // data: any[],
  mixBlendMode: 'normal',
  tooltip: new TooltipConfig({
    show: false,
    type: 'svg',
  }),
  // quantitative.valueAccessor: (d) => d,
  // quantitative.scaleType: scaleLinear,
  // category.valueAccessor: (d) => d,
  // category.colors: ['lightslategray'],
});

new LinesConfig({
  x: new QuantitativeDimension(),
  y: new QuantitativeDimension(),
  category: new CategoricalColorDimension(),
  // valueIsDefined?: (...args: any) => any,
  curve: curveLinear,
  pointMarker: new PointMarker(),
  stroke: new LinesStroke(),
  // labelLines?: boolean,
  // override tooltip: LinesTooltipConfig,
  // lineLabelsFormat?: (d: string) => string,
  // data: any[],
  mixBlendMode: 'normal',
  tooltip: new LinesTooltipConfig(),
  //x.valueAccessor: ([x]) => x,
  //x.scaleType: scaleUtc,
  //y.valueAccessor: ([, y]) => y,
  //y.scaleType: scaleLinear,
  //category.valueAccessor: () => 1,
  //category.colors: schemeTableau10 as string[],
  //stroke.width: 2,
  lineLabelsFormat: (d: string) => d,
});
