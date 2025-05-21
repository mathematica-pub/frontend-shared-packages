/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VicChartConfigBuilder } from '@hsi/viz-components';
import { DataService } from 'apps/my-work/src/app/core/services/data.service';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { mlbDataPath } from '../../ca-access/data-paths.constants';
import { MlbChartComponent } from '../mlb-chart.component';
// import { CsaDotPlotComponent } from './csa-dot-plot/csa-dot-plot.component';

export interface MlbDatum {
  lob: string;
  percentile25: number;
  percentile75: number;
  average: number;
  series: string;
  measureCode: string;
  delivSys: string;
  value: number;
  units: string;
  directionality: string;
  stratVal: string;
}

@Component({
  selector: 'app-mlb-percentiles',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    // CsaDotPlotComponent,
    ReactiveFormsModule,
  ],
  providers: [VicChartConfigBuilder],
  templateUrl: './mlb-percentiles.component.html',
  styleUrl: './mlb-percentiles.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MlbPercentilesComponent extends MlbChartComponent {
  override mlbDataPath = mlbDataPath;
  override filters = {
    measureCodes: [],
    delivSyss: [],
    stratVals: [],
  };
  override filterTypes = ['measureCode', 'stratVal'];

  constructor(dataService: DataService) {
    super(dataService);
  }

  override getTransformedData(data: MlbDatum[]): MlbDatum[] {
    const transformed: MlbDatum[] = data.map((x: any) => {
      const obj: MlbDatum = {
        series: 'percentile',
        lob: x.LOB,
        measureCode: x.Measure_Code,
        stratVal: x.StratVal,
        delivSys: x.DelivSys,
        units: x.Units,
        value:
          x.MLB_25 && !isNaN(x.MLB_25) && x.MLB_75 && !isNaN(x.MLB_75)
            ? Math.abs(x.MLB_75 - x.MLB_25)
            : null,
        average: x.average && !isNaN(x.average) ? +x.average : null,
        percentile25: x.MLB_25 && !isNaN(x.MLB_25) ? +x.MLB_25 : null,
        percentile75: x.MLB_75 && !isNaN(x.MLB_75) ? +x.MLB_75 : null,
        directionality: x.Directionality,
      };
      return obj;
    });
    return transformed;
  }
}
