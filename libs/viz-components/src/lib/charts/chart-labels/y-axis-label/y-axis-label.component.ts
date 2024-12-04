import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Host,
  Input,
  OnInit,
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
export class YAxisLabelComponent<Datum> implements OnInit {
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

  ngOnInit(): void {}

  // ngOnInit(): void {
  //   const chart = this.xyChart ? this.xyChart : this.mapChart;
  //   chart.margin$
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((margin) => {
  //       const titleContainer =
  //         this.el.nativeElement.querySelector('.vic-y-axis-label');

  //       if (this.orientation === 'vertical') {
  //         this.renderer.setStyle(titleContainer, 'writing-mode', 'vertical-lr');
  //       }

  //       const totalHeight = chart.height;
  //       const chartTitleHeight =
  //         chart.divRef.nativeElement.parentElement
  //           .querySelector('.vic-chart-title')
  //           ?.getBoundingClientRect().height || 0;
  //       const contentHeight = totalHeight - margin.top - margin.bottom;

  //       if (this.position === 'left') {
  //         this.renderer.setStyle(
  //           titleContainer,
  //           'left',
  //           `${this.horizontalOffset}px`
  //         );
  //       } else if (this.position === 'right') {
  //         this.renderer.setStyle(
  //           titleContainer,
  //           'right',
  //           `${this.horizontalOffset}px`
  //         );
  //       }

  //       if (this.alignment === 'top') {
  //         this.renderer.setStyle(
  //           titleContainer,
  //           'top',
  //           `${margin.top + chartTitleHeight + this.verticalOffset}px`
  //         );
  //       } else if (this.alignment === 'center') {
  //         this.renderer.setStyle(
  //           titleContainer,
  //           'top',
  //           `${contentHeight / 2 + chartTitleHeight + this.verticalOffset}px`
  //         );
  //       }
  //     });
  // }

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
