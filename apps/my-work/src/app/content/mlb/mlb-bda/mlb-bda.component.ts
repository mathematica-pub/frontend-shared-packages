/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { mlbDataPath } from '../../ca-access/data-paths.constants';
import { CaChartService } from '../../ca/ca-chart.service';
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
  providers: [CaChartService],
  templateUrl: 'mlb-bda.component.html',
  styleUrl: './mlb-bda.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MlbBdaComponent implements OnInit {
  mlbDataPath = mlbDataPath.bda;
  filters = {
    measureCodes: [],
  };
  filterTypes = ['measureCode'];
  chartName = 'BDA';

  constructor(public caChartService: CaChartService) {}

  ngOnInit(): void {
    this.caChartService.init(
      this.filters,
      this.filterTypes,
      this.mlbDataPath,
      this.getTransformedData.bind(this)
    );
  }

  getTransformedData(data: MlbBdaDatum[]): MlbBdaDatum[] {
    const transformed: MlbBdaDatum[] = data.map((x: any) => {
      const obj: MlbBdaDatum = {
        series: 'percentile',
        measureCode: x.Measure_Code,
        units: x.Units,
        directionality: x.Directionality,
        strat: x.STRAT,
        stratVal: x.StratVal_v2,
        lob: x.LOB,
        comparison: x.Comparison === 'TRUE',
        value: null, // null to avoid bars
        average: x.Value && !isNaN(x.Value) ? +x.Value : null,
      };
      return obj;
    });
    return transformed.filter((x: MlbBdaDatum) => {
      const strat = x.strat.toLowerCase();
      return this.isMatchingStrat(strat) && x.comparison === false;
    });
  }

  isMatchingStrat(strat: string): boolean {
    return strat.includes('race') || strat.includes('ethnicity');
  }
}
