/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { finalDataPath } from '../../ca/data-paths.constants';
import { FinalDatum } from '../final-vertical-stacked-bars.component';
import { FinalRaceArrowComponent } from './final-race-arrow/final-race-arrow.component';

export interface FinalRaceDatum extends FinalDatum {
  change: string;
  year: string;
  increased: boolean;
}

@Component({
  selector: 'app-final-race',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    FinalRaceArrowComponent,
  ],
  providers: [CaChartService],
  templateUrl: 'final-race.component.html',
  styleUrl: './final-race.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FinalRaceComponent implements OnInit {
  chartName = 'Final Race Chart';
  finalDataPath = finalDataPath.stratified;
  filters = {
    measureCodes: [],
  };
  filterTypes = ['measureCode'];

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

  getTransformedData(data: FinalRaceDatum[]): FinalRaceDatum[] {
    const transformed: FinalRaceDatum[] = data.map((x: any) => {
      const obj: FinalRaceDatum = {
        series: 'percentile',
        measureCode: x.Measure_Code,
        units: x.Units,
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
    return transformed.filter((x: FinalRaceDatum) => {
      const strat = x.strat.toLowerCase();
      return this.isMatchingStrat(strat);
    });
  }

  isMatchingStrat(strat: string): boolean {
    return strat.includes('race') || strat.includes('ethnicity');
  }
}
