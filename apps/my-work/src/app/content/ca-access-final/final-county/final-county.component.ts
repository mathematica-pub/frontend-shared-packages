/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { finalDataPath } from '../../ca/data-paths.constants';
import { FinalRaceDatum } from '../final-race/final-race.component';
import { FinalCountyArrowComponent } from './final-county-arrow/final-county-arrow.component';

export interface FinalCountyDatum extends FinalRaceDatum {
  county: string;
}

@Component({
  selector: 'app-final-county',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    FinalCountyArrowComponent,
  ],
  providers: [CaChartService],
  templateUrl: 'final-county.component.html',
  styleUrl: './final-county.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FinalCountyComponent implements OnInit {
  chartName = 'Final County Chart';
  finalDataPath = finalDataPath.stratified;
  filters = {
    measureCodes: [],
    stratVals: [],
  };
  filterTypes = ['measureCode', 'stratVal'];

  constructor(public caChartService: CaChartService) {}

  ngOnInit(): void {
    const caChartDataConfig: CaChartDataConfig = {
      filters: this.filters,
      filterTypes: this.filterTypes,
      dataPath: this.finalDataPath,
      getTransformedData: this.getTransformedData.bind(this),
    };
    this.caChartService.init(caChartDataConfig);
  }

  getTransformedData(data: FinalCountyDatum[]): FinalCountyDatum[] {
    const transformed: FinalCountyDatum[] = data.map((x: any) => {
      const obj: FinalCountyDatum = {
        series: 'percentile',
        measureCode: x.Measure_Code,
        units: x.Units,
        county: x.County,
        directionality: x.Directionality,
        strat: x.STRAT,
        stratVal: x.StratVal,
        value: x.Value && !isNaN(x.Value) ? +x.Value : null,
        year: x.Year,
        change: x.Change,
        increased: null,
      };
      return obj;
    });
    return transformed.filter((x: FinalCountyDatum) => {
      const strat = x.strat.toLowerCase();
      return this.isMatchingStrat(strat);
    });
  }

  isMatchingStrat(strat: string): boolean {
    return strat === 'null';
  }
}
