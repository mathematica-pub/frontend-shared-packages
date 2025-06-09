/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { DataService } from '../../../core/services/data.service';
import { mlbDataPath } from '../../ca-access/data-paths.constants';
import { MlbChartComponent } from '../mlb-chart.component';
import { MlbDatum } from '../mlb-stacked-bars.component';
import { MlbCountyPlotDotPlotComponent } from './mlb-county-plot-dot-plot/mlb-county-plot-dot-plot.component';

export interface MlbCsaDatum extends MlbDatum {
  county: string;
}

@Component({
  selector: 'app-mlb-county-plot',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    MlbCountyPlotDotPlotComponent,
  ],
  templateUrl: 'mlb-county-plot.component.html',
  styleUrl: './mlb-county-plot.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MlbCountyPlotComponent extends MlbChartComponent {
  override mlbDataPath = mlbDataPath.csa;
  override filters = {
    measureCodes: [],
    stratVals: [],
  };
  override filterTypes = ['measureCode', 'stratVal'];

  constructor(dataService: DataService) {
    super(dataService);
  }

  override getTransformedData(data: MlbCsaDatum[]): MlbCsaDatum[] {
    const transformed: MlbCsaDatum[] = data.map((x: any) => {
      const obj: MlbCsaDatum = {
        series: 'percentile',
        measureCode: x.Measure_Code,
        units: x.Units,
        county: x.County,
        directionality: x.Directionality,
        stratVal: x.StratVal,
        lob: x.LOB,
        comparison: x.Comparison === 'TRUE',
        value: null, // null to avoid bars
        average: x.Value && !isNaN(x.Value) ? +x.Value : null,
      };
      return obj;
    });
    return transformed;
  }
}
