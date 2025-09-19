/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { CaStackedBarsService } from '../../ca/ca-stacked-bars.service';
import { mlbDataPath } from '../../ca/data-paths.constants';
import { MlbDatum } from '../mlb-stacked-bars.component';
import { MlbRaceEthnicityDotPlotComponent } from './mlb-race-ethnicity-dot-plot/mlb-race-ethnicity-dot-plot.component';

export interface MlbRaceDatum extends MlbDatum {
  strat: string;
}

@Component({
  selector: 'app-mlb-race-ethnicity',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    MlbRaceEthnicityDotPlotComponent,
  ],
  providers: [CaChartService, CaStackedBarsService],
  templateUrl: 'mlb-race-ethnicity.component.html',
  styleUrl: './mlb-race-ethnicity.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MlbRaceEthnicityComponent implements OnInit {
  mlbDataPath = mlbDataPath.mlb;
  filters = {
    measureCodes: [],
  };
  filterTypes = ['measureCode'];
  chartName = 'Race Ethnicity';

  constructor(public caChartService: CaChartService) {}

  ngOnInit(): void {
    const caChartDataConfig: CaChartDataConfig = {
      filters: this.filters,
      filterTypes: this.filterTypes,
      dataPath: this.mlbDataPath,
      getTransformedData: this.getTransformedData.bind(this),
    };
    this.caChartService.init(caChartDataConfig);
  }

  getTransformedData(data: MlbRaceDatum[]): MlbRaceDatum[] {
    const transformed: MlbRaceDatum[] = data.map((x: any) => {
      const obj: MlbRaceDatum = {
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
    return transformed.filter((x: MlbRaceDatum) => {
      const strat = x.strat.toLowerCase();
      return this.isMatchingStrat(strat) && x.comparison === false;
    });
  }

  isMatchingStrat(strat: string): boolean {
    return strat.includes('race') || strat.includes('ethnicity');
  }
}
