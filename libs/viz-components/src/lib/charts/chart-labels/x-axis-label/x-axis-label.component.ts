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
  selector: 'vic-x-axis-label',
  standalone: true,
  imports: [],
  templateUrl: './x-axis-label.component.html',
  styleUrl: './x-axis-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XAxisLabelComponent<Datum> implements OnInit {
  @Input() alignment: 'left' | 'center' = 'left';
  @Input() position: 'top' | 'bottom' = 'bottom';
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
          this.el.nativeElement.querySelector('.vic-x-axis-label');

        const totalWidth = chart.width;
        const contentWidth = totalWidth - margin.left - margin.right;
        const chartTitleHeight =
          chart.divRef.nativeElement.parentElement
            .querySelector('.vic-chart-title')
            ?.getBoundingClientRect().height || 0;
        const titleWidth = titleContainer.offsetWidth;
        if (this.position === 'top') {
          this.renderer.setStyle(
            titleContainer,
            'top',
            `${this.verticalOffset + chartTitleHeight}px`
          );
        } else if (this.position === 'bottom') {
          this.renderer.setStyle(
            titleContainer,
            'bottom',
            `${this.verticalOffset}px`
          );
        }

        if (this.alignment === 'left') {
          this.renderer.setStyle(titleContainer, 'left', `${margin.left}px`);
        } else if (this.alignment === 'center') {
          this.renderer.setStyle(
            titleContainer,
            'left',
            `${margin.left + contentWidth / 2 - titleWidth / 2}px`
          );
        }
      });
  }
}
