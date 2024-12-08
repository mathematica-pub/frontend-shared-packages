import { Component, Input } from '@angular/core';
import { BarsOptions } from '../../bars';
import { VicQuantitativeAxisConfig } from '../quantitative/quantitative-axis-config';

@Component({
  selector: 'vic-test-x-quantitative-axis',
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
        ></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-primary-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestXQuantitativeAxisComponent {
  @Input() barsConfig: BarsOptions<{ state: string; value: number }, string>;
  @Input() xQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = { top: 20, right: 20, bottom: 20, left: 20 };
}
