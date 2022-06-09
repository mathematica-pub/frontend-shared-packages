import { Component, Input, OnInit } from '@angular/core';
import { axisBottom, axisTop } from 'd3';
import { takeUntil } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { XYAxisElement } from '../xy-chart-space/xy-axis.class';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[m-charts-x-axis]',
  templateUrl: './x-axis.component.html',
  styleUrls: ['./x-axis.component.scss'],
})
export class XAxisComponent extends XYAxisElement implements OnInit {
  @Input() side: 'top' | 'bottom' = 'top';
  translate: number;

  constructor(
    public chart: ChartComponent,
    public xySpace: XYChartSpaceComponent
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToScale();
  }

  subscribeToScale(): void {
    this.xySpace.xScale.pipe(takeUntil(this.unsubscribe)).subscribe((scale) => {
      if (scale) {
        this.scale = scale;
        this.updateAxis();
      }
    });
  }

  getAxisFunction(): any {
    return this.side === 'top' ? axisTop : axisBottom;
  }

  initNumTicks(): number {
    return this.chart.width / 40; // default in D3 example
  }

  setTranslate(): void {
    if (this.side === 'top') {
      this.translate = this.chart.margin.top;
    } else {
      this.translate = this.chart.getScaledHeight() - this.chart.margin.bottom;
    }
  }
}
