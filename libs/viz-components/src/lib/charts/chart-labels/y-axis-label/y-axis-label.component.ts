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

        // const titleMainContainer =
        //   this.el.nativeElement.querySelector('.vic-chart-title');

        // const titleMainHeight =
        //   titleMainContainer.getBoundingClientRect().height;
        // chart.height

        // if it's vertical, do some stuff if horizontal, do other stuff

        const textWidth = titleContainer.getBoundingClientRect().height;

        // remove the vertical height from the parent container, vic-y-axis-label
        // change from inline display to block display to allow for height to be set to zero
        // get the height of the title container
        const totalHeight = chart.height;
        const chartTitleHeight = chart.divRef.nativeElement.parentElement
          .querySelector('.vic-chart-title')
          .getBoundingClientRect().height;
        const chartXAxisHeight = chart.divRef.nativeElement
          .querySelector('.vic-x')
          .getBoundingClientRect().height;
        console.log(chartXAxisHeight);
        console.log(
          'margin top: ',
          margin.top,
          'Text width: ',
          textWidth / 2,
          'chart title height: ',
          chartTitleHeight
        );
        const contentHeight = totalHeight - margin.top - margin.bottom;

        this.renderer.setStyle(titleContainer, 'left', `-${textWidth / 2}px`);

        if (this.alignment === 'top') {
          this.renderer.setStyle(
            titleContainer,
            'top',
            `${margin.top + textWidth / 2 + chartTitleHeight}px`
          );
        } else if (this.alignment === 'center') {
          // const totalWidth = chart.width;
          // const contentWidth = totalWidth - margin.left - margin.right;
          // this.renderer.setStyle(titleContainer, 'width', `${contentWidth}px`);
          this.renderer.setStyle(
            titleContainer,
            'top',
            `${contentHeight / 2 + textWidth / 2 + chartTitleHeight + chartXAxisHeight}px`
          );
        }
      });
  }
}
