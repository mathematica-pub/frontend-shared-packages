import { Component, Input, OnInit } from '@angular/core';
import { axisLeft, axisRight } from 'd3';
import { map, Observable, takeUntil } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { XyAxisElement } from '../xy-chart-space/xy-axis.class';
import { XyChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[m-charts-y-axis]',
  templateUrl: './y-axis.component.html',
  styleUrls: ['./y-axis.component.scss'],
})
export class YAxisComponent extends XyAxisElement implements OnInit {
  @Input() side: 'left' | 'right' = 'left';
  translate$: Observable<string>;

  constructor(
    public chart: ChartComponent,
    public xySpace: XyChartSpaceComponent
  ) {
    super();
  }

  setTranslate(): void {
    this.translate$ = this.chart.ranges$.pipe(
      map((ranges) => {
        let translate;
        if (this.side === 'left') {
          translate = ranges.x[0];
        } else {
          translate = ranges.x[1] - ranges.x[0] - this.chart.margin.right;
        }
        return `translate(${translate}, 0)`;
      })
    );
  }

  subscribeToScale(): void {
    this.xySpace.yScale$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((scale) => {
        if (scale) {
          this.scale = scale;
          this.updateAxis();
        }
      });
  }

  setAxisFunction(): void {
    this.axisFunction = this.side === 'left' ? axisLeft : axisRight;
  }

  initNumTicks(): number {
    return this.chart.height / 50; // default in D3 example
  }
}
