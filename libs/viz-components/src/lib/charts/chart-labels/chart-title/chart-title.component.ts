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
  selector: 'vic-chart-title',
  standalone: true,
  imports: [],
  templateUrl: './chart-title.component.html',
  styleUrl: './chart-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTitleComponent<Datum> implements OnInit {
  @Input() alignment: 'left' | 'center' = 'left';

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
          this.el.nativeElement.querySelector('.vic-chart-title');

        if (this.alignment === 'left') {
          this.renderer.setStyle(
            titleContainer,
            'marginLeft',
            `${margin.left}px`
          );
          this.renderer.setStyle(titleContainer, 'textAlign', 'left');
        } else if (this.alignment === 'center') {
          const totalWidth = chart.width;
          const contentWidth = totalWidth - margin.left - margin.right;

          this.renderer.setStyle(titleContainer, 'textAlign', 'center');
          this.renderer.setStyle(titleContainer, 'width', `${contentWidth}px`);
          this.renderer.setStyle(
            titleContainer,
            'marginLeft',
            `${margin.left}px`
          );
        }
      });
  }
}
