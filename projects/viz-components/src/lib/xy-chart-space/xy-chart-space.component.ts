import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vzc-xy-chart-space]',
  templateUrl: './xy-chart-space.component.html',
  styleUrls: ['./xy-chart-space.component.scss'],
})
export class XyChartSpaceComponent {
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
