import { inject } from '@angular/core';
import { Ranges } from '../chart/chart.component';
import { VicIMarks } from '../data-marks/data-marks-types';
import {
  XyChartComponent,
  XyChartScales,
} from '../xy-chart/xy-chart.component';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class XyDataMarksValues {
  x: any[];
  y: any[];
  category: string[];
  indicies: number[];
}

export abstract class VicXyMarks implements VicIMarks {
  chart = inject(XyChartComponent);
  scales: XyChartScales;
  ranges: Ranges;
  drawMarks: () => void;
  resizeMarks: () => void;

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }
}
