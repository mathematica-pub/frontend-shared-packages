import { Component, Input } from '@angular/core';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-xy-background]',
  templateUrl: './xy-background.component.html',
  styleUrls: ['./xy-background.component.scss'],
})
export class XyBackgroundComponent {
  @Input() color = 'whitesmoke';

  constructor(public chart: XyChartComponent) {}
}
