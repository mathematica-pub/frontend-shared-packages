import { Component, Input, OnInit } from '@angular/core';
import { axisLeft, axisRight } from 'd3';
import { map, Observable, takeUntil } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { XyAxisElement } from '../xy-chart-space/xy-axis.class';
import { XyChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vzc-y-axis]',
  templateUrl: './y-axis.component.html',
  styleUrls: ['./y-axis.component.scss'],
})
export class YAxisComponent extends XyAxisElement implements OnInit {
  /**
   * @param 'left'|'right' side Determines which side YAxis should display on,
   * default is 'left'
   */
  @Input() side: 'left' | 'right' = 'left';
  /**
   * @internal
   */
  translate$: Observable<string>;

  constructor(
    public chart: ChartComponent,
    public xySpace: XyChartSpaceComponent
  ) {
    super();
  }

  /**
   * Sets the translate observable based on the range (width?) of the chart,
   * and the side the axis is supposed to display on.
   */
  setTranslate(): void {
    this.translate$ = this.chart.ranges$.pipe(
      map((ranges) => {
        let translate;
        if (this.side === 'left') {
          translate = ranges.x[0];
        } else {
          // QUESTION: why are ranges used here instead of dimensions?
          translate = ranges.x[1] - ranges.x[0] - this.chart.margin.right;
        }
        return `translate(${translate}, 0)`;
      })
    );
  }

  /**
   * Subscribes to the yScale observable. On receiving a new scale,
   * calls updateAxis.
   */
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

  /**
   * Sets the D3 axis function (that constructs the axis generator)
   * based on the value of side
   */
  setAxisFunction(): void {
    this.axisFunction = this.side === 'left' ? axisLeft : axisRight;
  }

  /**
   * Initializes the number of ticks the axis has based on the height
   * of the chart
   *
   * @returns {number} number of ticks
   */
  initNumTicks(): number {
    return this.chart.height / 50; // default in D3 example
  }
}
