import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VIC_DATA_MARKS } from 'projects/viz-components/src/lib/data-marks/data-marks-base';
import {
  ChartComponent,
  LINES,
  LinesComponent,
  VicLinesModule,
  XyChartComponent,
} from 'projects/viz-components/src/public-api';

@Component({
  selector: '[app-standalone-line]',
  standalone: true,
  imports: [CommonModule, VicLinesModule],
  templateUrl: './standalone-line.component.html',
  styleUrls: [],
  providers: [
    { provide: VIC_DATA_MARKS, useExisting: LinesComponent },
    { provide: LINES, useExisting: LinesComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class StandaloneLineComponent<Datum> extends LinesComponent<Datum> {
  override setPropertiesFromRanges(): void {
    return;
  }
}
