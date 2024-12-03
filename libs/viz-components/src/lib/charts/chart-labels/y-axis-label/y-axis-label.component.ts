import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Host,
  Input,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MapChartComponent } from '../../map-chart/map-chart.component';
import { XyChartComponent } from '../../xy-chart/xy-chart.component';

@Component({
  selector: 'vic-y-axis-label',
  standalone: true,
  imports: [],
  templateUrl: './y-axis-label.component.html',
  styleUrl: './y-axis-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YAxisLabelComponent<Datum> implements OnInit {
  @Input() alignment: 'top' | 'center' = 'top';
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';
  @Input() verticalOffset: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private destroyRef: DestroyRef,
    @Optional() @Host() private xyChart: XyChartComponent,
    @Optional() @Host() private mapChart: MapChartComponent<Datum>
  ) {}

  ngOnInit(): void {
    const chart = this.xyChart ? this.xyChart : this.mapChart;
    chart.margin$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((margin) => {
        const titleContainer =
          this.el.nativeElement.querySelector('.vic-y-axis-label');

        if (this.orientation === 'vertical') {
          this.renderer.setStyle(titleContainer, 'writing-mode', 'vertical-lr');
        }

        const totalHeight = chart.height;
        const chartTitleHeight = chart.divRef.nativeElement.parentElement
          .querySelector('.vic-chart-title')
          .getBoundingClientRect().height;
        const contentHeight = totalHeight - margin.top - margin.bottom;

        if (this.alignment === 'top') {
          this.renderer.setStyle(
            titleContainer,
            'top',
            `${margin.top + chartTitleHeight + this.verticalOffset}px`
          );
        } else if (this.alignment === 'center') {
          this.renderer.setStyle(
            titleContainer,
            'top',
            `${contentHeight / 2 + chartTitleHeight + this.verticalOffset}px`
          );
        }
      });
  }
}
