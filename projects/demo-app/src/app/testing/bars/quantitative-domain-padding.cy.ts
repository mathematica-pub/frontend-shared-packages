import { Component, Input } from '@angular/core';
import {
  VicAxisConfig,
  VicBarsConfig,
  VicBarsLabelsConfig,
  VicBarsModule,
  VicChartModule,
  VicHorizontalBarsDimensionsConfig,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
} from 'projects/viz-components/src/public-api';

@Component({
  selector: 'app-test-bars-quantitative-domain-padding',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="800"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
          side="top"
        ></svg:g>
        <svg:g vic-data-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestXQuantitativeAxisComponent {
  @Input() barsConfig: VicBarsConfig;
  @Input() xQuantitativeAxisConfig: VicAxisConfig;
  margin = { top: 20, right: 20, bottom: 20, left: 20 };
}

describe('it correctly sets quantitative domain', () => {
  let barsConfig: VicBarsConfig;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeAxisComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.data = [];
    barsConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.data = [
      { state: 'Alabama', value: 1.1 },
      { state: 'Alaska', value: 2.2 },
      { state: 'Arizona', value: 30.3 },
    ];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    axisConfig = new VicAxisConfig();
    axisConfig.tickFormat = '.0f';
  });
