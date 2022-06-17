import {
  Component,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { ChartComponent } from '../../chart/chart.component';
import { Ranges } from '../../chart/chart.model';
import { UtilitiesService } from '../../core/services/utilities.service';
import { Unsubscribe } from '../../shared/unsubscribe.class';
import { XyChartSpaceComponent } from '../../xy-chart-space/xy-chart-space.component';
import { DataMarksConfig } from '../data-marks.model';
import { XyDataMarks, XyDataMarksValues } from '../xy-data-marks.model';

@Component({ template: '' })
export class XyDataMarksComponent
  extends Unsubscribe
  implements XyDataMarks, OnChanges, OnInit
{
  config: DataMarksConfig;
  values: XyDataMarksValues = new XyDataMarksValues();
  xScale: (d: any) => any;
  yScale: (d: any) => any;
  setRanges: (ranges: Ranges) => void;
  setMethodsFromConfigAndDraw: () => void;
  setValueArrays: () => void;
  drawMarks: (transitionDuration: number) => void;
  resizeMarks: () => void;
  onPointerEnter: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;

  constructor(
    public chart: ChartComponent,
    public xySpace: XyChartSpaceComponent,
    private utilities: UtilitiesService,
    private zone: NgZone
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.utilities.objectChangedNotFirstTime(changes, 'config')) {
      this.setMethodsFromConfigAndDraw();
    }
  }

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToScales();
    this.setMethodsFromConfigAndDraw();
  }

  subscribeToRanges(): void {
    this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
      this.setRanges(ranges);
      if (this.xScale && this.yScale) {
        this.zone.run(() => {
          this.resizeMarks();
        });
      }
    });
  }

  subscribeToScales(): void {
    const subscriptions = [this.xySpace.xScale$, this.xySpace.yScale$];
    combineLatest(subscriptions)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([xScale, yScale]): void => {
        this.xScale = xScale;
        this.yScale = yScale;
      });
  }
}
