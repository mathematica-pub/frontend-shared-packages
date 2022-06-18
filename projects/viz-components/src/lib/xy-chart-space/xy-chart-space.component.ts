import { Component, ContentChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { XyDataMarks } from '../data-marks/xy-data-marks.model';
import { XY_DATA_MARKS } from '../data-marks/xy-data-marks.token';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vzc-xy-chart-space]',
  templateUrl: './xy-chart-space.component.html',
  styleUrls: ['./xy-chart-space.component.scss'],
})
export class XyChartSpaceComponent {
  @ContentChild(XY_DATA_MARKS)
  xyDataMarksComponent: XyDataMarks;
  private xScale: BehaviorSubject<any> = new BehaviorSubject(null);
  xScale$ = this.xScale.asObservable();
  private yScale: BehaviorSubject<any> = new BehaviorSubject(null);
  yScale$ = this.yScale.asObservable();

  updateXScale(scale: any): void {
    this.xScale.next(scale);
  }

  updateYScale(scale: any): void {
    this.yScale.next(scale);
  }
}
