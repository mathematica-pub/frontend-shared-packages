import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Host,
  Input,
  OnDestroy,
  OnInit,
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
export class XAxisLabelComponent<Datum> implements OnInit, OnDestroy {
  @Input() alignment: 'left' | 'center' = 'left';
  @Input() position: 'top' | 'bottom' = 'bottom';
  @Input() verticalOffset: number = 0;
  private resizeObserver: ResizeObserver;

  constructor(
    private el: ElementRef,
    @Optional() @Host() private xyChart: XyChartComponent,
    @Optional() @Host() private mapChart: MapChartComponent<Datum>
  ) {}

  get chart() {
    return this.xyChart ? this.xyChart : this.mapChart;
  }

  ngOnInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.updatePosition();
    });

    this.resizeObserver.observe(this.chart.divRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  updatePosition(): void {
    let margin: ElementSpacing;
    this.chart.margin$.subscribe((value) => (margin = value));
    const titleContainer =
      this.el.nativeElement.querySelector('.vic-x-axis-label');
    titleContainer.style.left = this.calculateLeft(margin);
    titleContainer.style.top = this.calculateTop();
  }

  calculateLeft(margin: ElementSpacing): string {
    const chartWidth = this.chart.divRef.nativeElement.clientWidth;
    const contentWidth = chartWidth - margin.left - margin.right;
    const titleEl = this.el.nativeElement.querySelector('.vic-x-axis-label');
    if (this.alignment === 'left') {
      return `${margin.left}px`;
    } else if (this.alignment === 'center') {
      return `${margin.left + contentWidth / 2 - titleEl.offsetWidth / 2}px`;
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
