/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { DataService } from '../../../core/services/data.service';
import { mlbDataPath } from '../../ca-access/data-paths.constants';
import { MlbChartComponent } from '../mlb-chart.component';
import { MlbDatum } from '../mlb-stacked-bars.component';
import { MlbBdaDotPlotComponent } from './mlb-bda-dot-plot/mlb-bda-dot-plot.component';

export interface MlbBdaDatum extends MlbDatum {
  strat: string;
}

@Component({
  selector: 'app-mlb-bda',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    MlbBdaDotPlotComponent,
  ],
  templateUrl: 'mlb-bda.component.html',
  styleUrl: './mlb-bda.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MlbBdaComponent extends MlbChartComponent {
  override mlbDataPath = mlbDataPath.bda;
  override filters = {
    measureCodes: [],
  };
  override filterTypes = ['measureCode'];

  constructor(dataService: DataService) {
    super(dataService);
  }

  override getTransformedData(data: MlbBdaDatum[]): MlbBdaDatum[] {
    const transformed: MlbBdaDatum[] = data.map((x: any) => {
      const obj: MlbBdaDatum = {
        series: 'percentile',
        measureCode: x.Measure_Code,
        units: x.Units,
        directionality: x.Directionality,
        strat: x.STRAT,
        stratVal: x.StratVal_v2,
        lob: x.LOB,
        value: null, // null to avoid bars
        average: x.Value && !isNaN(x.Value) ? +x.Value : null,
      };
      return obj;
    });
    return transformed.filter((x: MlbBdaDatum) => {
      const strat = x.strat.toLowerCase();
      return strat.includes('race') || strat.includes('ethnicity');
    });
  }
}
