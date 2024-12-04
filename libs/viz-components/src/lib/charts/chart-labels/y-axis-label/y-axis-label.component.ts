import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Host,
  Input,
  Optional,
} from '@angular/core';
import { ElementSpacing } from '../../../core';
import { MapChartComponent } from '../../map-chart/map-chart.component';
import { XyChartComponent } from '../../xy-chart/xy-chart.component';

@Component({
  selector: 'vic-y-axis-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './y-axis-label.component.html',
  styleUrl: './y-axis-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YAxisLabelComponent<Datum> {
  @Input() alignment: 'top' | 'center' = 'top';
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';
  @Input() position: 'left' | 'right' = 'left';
  @Input() verticalOffset: number = 0;
  @Input() horizontalOffset: number = 0;

  constructor(
    @Optional() @Host() private xyChart: XyChartComponent,
    @Optional() @Host() private mapChart: MapChartComponent<Datum>
  ) {}

  get chart() {
    return this.xyChart ? this.xyChart : this.mapChart;
  }

  calculateTop(margin: ElementSpacing): string {
    const chartTitleHeight =
      this.chart.divRef.nativeElement.parentElement
        .querySelector('.vic-chart-title')
        ?.getBoundingClientRect().height || 0;

    if (this.alignment === 'top') {
      return `${margin.top + chartTitleHeight + this.verticalOffset}px`;
    } else if (this.alignment === 'center') {
      const contentHeight = this.chart.height - margin.top - margin.bottom;
      return `${contentHeight / 2 + chartTitleHeight + this.verticalOffset}px`;
    }
    return 'auto';
  }
}
