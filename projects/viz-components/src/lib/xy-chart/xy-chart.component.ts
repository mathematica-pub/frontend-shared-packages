import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'vic-xy-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XyChartComponent extends ChartComponent implements OnInit {
  private xScale: BehaviorSubject<any> = new BehaviorSubject(null);
  xScale$ = this.xScale.asObservable();
  private yScale: BehaviorSubject<any> = new BehaviorSubject(null);
  yScale$ = this.yScale.asObservable();
  private categoryScale: BehaviorSubject<any> = new BehaviorSubject(null);
  categoryScale$ = this.categoryScale.asObservable();

  updateXScale(scale: any): void {
    this.xScale.next(scale);
  }

  updateYScale(scale: any): void {
    this.yScale.next(scale);
  }

  updateCategoryScale(scale: any): void {
    this.categoryScale.next(scale);
  }
}
