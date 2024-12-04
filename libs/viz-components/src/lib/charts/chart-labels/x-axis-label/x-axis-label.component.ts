import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Host,
  Input,
  Optional,
} from '@angular/core';
import { ElementSpacing } from '../../../core';
import { MapChartComponent } from '../../map-chart/map-chart.component';
import { XyChartComponent } from '../../xy-chart/xy-chart.component';

@Component({
  selector: 'vic-x-axis-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './x-axis-label.component.html',
  styleUrl: './x-axis-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XAxisLabelComponent<Datum> {
  @Input() alignment: 'left' | 'center' = 'left';
  @Input() position: 'top' | 'bottom' = 'bottom';
  @Input() verticalOffset: number = 0;

  constructor(
    private el: ElementRef,
    @Optional() @Host() private xyChart: XyChartComponent,
    @Optional() @Host() private mapChart: MapChartComponent<Datum>
  ) {}

  get chart() {
    return this.xyChart ? this.xyChart : this.mapChart;
  }

  calculateLeft(margin: ElementSpacing): string {
    const contentWidth = this.chart.width - margin.left - margin.right;
    const titleWidth =
      this.el.nativeElement.querySelector('.vic-x-axis-label').offsetWidth;
    if (this.alignment === 'left') {
      return `${margin.left}px`;
    } else if (this.alignment === 'center') {
      return `${margin.left + contentWidth / 2 - titleWidth / 2}px`;
    }
    return 'null';
  }

  calculateTop(): string {
    const chartTitleHeight =
      this.chart.divRef.nativeElement.parentElement
        .querySelector('.vic-chart-title')
        ?.getBoundingClientRect().height || 0;

    if (this.position === 'top') {
      return `${this.verticalOffset + chartTitleHeight}px`;
    }
    return 'auto';
  }
}
