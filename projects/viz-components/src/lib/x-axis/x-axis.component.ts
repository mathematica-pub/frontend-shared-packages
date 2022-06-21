import { Component, Input, OnInit } from '@angular/core';
import { axisBottom, axisTop } from 'd3';
import { map, Observable, pairwise, takeUntil } from 'rxjs';
import { XyAxisElement } from '../xy-chart-space/xy-axis.class';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vzc-x-axis]',
  templateUrl: './x-axis.component.html',
  styleUrls: ['./x-axis.component.scss'],
})
export class XAxisComponent extends XyAxisElement implements OnInit {
  @Input() side: 'top' | 'bottom' = 'top';
  translate$: Observable<string>;

  setTranslate(): void {
    this.translate$ = this.chart.ranges$.pipe(
      map((ranges) => {
        let translate;
        if (this.side === 'top') {
          translate = ranges.y[1];
        } else {
          translate = ranges.y[0] - ranges.y[1] + this.chart.margin.top;
        }
        return `translate(0, ${translate})`;
      })
    );
  }

  subscribeToScale(): void {
    this.xySpace.xScale$
      .pipe(takeUntil(this.unsubscribe), pairwise())
      .subscribe(([prev, curr]) => this.onScaleUpdate(prev, curr));
  }

  setAxisFunction(): void {
    this.axisFunction = this.side === 'top' ? axisTop : axisBottom;
  }

  initNumTicks(): number {
    return this.chart.width / 40; // default in D3 example
  }
}
