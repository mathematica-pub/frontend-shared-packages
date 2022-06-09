import { Component, Input } from '@angular/core';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[m-charts-xy-chart-background]',
  templateUrl: './xy-chart-background.component.html',
  styleUrls: ['./xy-chart-background.component.scss'],
})
export class XYChartBackgroundComponent {
  @Input() color = 'whitesmoke';

  constructor(public xySpace: XYChartSpaceComponent) {}
}
