import {
  AfterContentInit,
  Component,
  ContentChild,
  InjectionToken,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataMarksComponent } from '../data-marks/data-marks.model';
import { DATA_MARKS_COMPONENT } from '../data-marks/data-marks.token';

export const XY_SPACE = new InjectionToken<XYChartSpaceComponent>('XY_SPACE');
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[m-charts-xy-chart-space]',
  templateUrl: './xy-chart-space.component.html',
  styleUrls: ['./xy-chart-space.component.scss'],
})
export class XYChartSpaceComponent implements AfterContentInit {
  @ContentChild(DATA_MARKS_COMPONENT) dataMarksComponent: DataMarksComponent;
  xScale: BehaviorSubject<any> = new BehaviorSubject(null);
  xScale$ = this.xScale.asObservable();
  yScale: BehaviorSubject<any> = new BehaviorSubject(null);
  yScale$ = this.yScale.asObservable();

  ngAfterContentInit(): void {
    this.dataMarksComponent.setMethodsFromConfigAndDraw();
  }

  updateXScale(scale: any): void {
    this.xScale.next(scale);
  }

  updateYScale(scale: any): void {
    this.yScale.next(scale);
  }
}
