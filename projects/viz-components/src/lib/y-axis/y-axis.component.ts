import { Component, Input, OnInit } from '@angular/core';
import { axisLeft, axisRight } from 'd3';
import { takeUntil } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { XYAxisElement } from '../xy-chart-space/xy-axis.class';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[m-charts-y-axis]',
  templateUrl: './y-axis.component.html',
  styleUrls: ['./y-axis.component.scss'],
})
export class YAxisComponent extends XYAxisElement implements OnInit {
  @Input() side: 'left' | 'right' = 'left';
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
    this.xySpace.yScale.pipe(takeUntil(this.unsubscribe)).subscribe((scale) => {
      if (scale) {
        this.scale = scale;
        this.updateAxis();
      }
    });
  }

  getAxisFunction(): any {
    return this.side === 'left' ? axisLeft : axisRight;
  }

  initNumTicks(): number {
    return this.chart.height / 50; // default in D3 example
  }

  setTranslate(): void {
    if (this.side === 'left') {
      this.translate = this.chart.margin.left;
    } else {
      this.translate = this.chart.getScaledWidth() - this.chart.margin.right;
    }
  }
}
