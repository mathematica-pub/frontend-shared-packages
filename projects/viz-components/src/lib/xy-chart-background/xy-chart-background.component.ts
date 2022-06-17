import { Component, Input } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[m-charts-xy-chart-background]',
  templateUrl: './xy-chart-background.component.html',
  styleUrls: ['./xy-chart-background.component.scss'],
})
export class XYChartBackgroundComponent {
  @Input() color = 'whitesmoke';

  constructor(public chart: ChartComponent) {}
}
