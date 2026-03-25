import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-xy-background]',
  templateUrl: './xy-background.component.html',
  styleUrls: ['./xy-background.component.scss'],
  host: {
    class: 'vic-xy-background',
  },
  imports: [AsyncPipe, CommonModule],
})
export class XyBackgroundComponent {
  @Input() color = 'whitesmoke';

  public chart = inject(XyChartComponent);
}
