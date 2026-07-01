/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { raceCategories } from '../../ca/ca.constants';
import { finalDataPath } from '../../ca/data-paths.constants';
import { FinalDatum } from '../final-vertical-stacked-bars.component';
import { FinalRaceArrowComponent } from './final-race-arrow/final-race-arrow.component';

export interface FinalRaceDatum extends FinalDatum {
  // change: string;
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
    delivSyss: [],
    measureCodes: [],
  };
  filterTypes = ['delivSys', 'measureCode'];

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
    const order = structuredClone(raceCategories);
    const transformed: FinalRaceDatum[] = data.map((x: any) => {
      const obj: FinalRaceDatum = {
        series: 'percentile',
        measureCode: x.MSR,
        units: x.Unit,
        directionality: x.Directionality,
        strat: x.STRAT,
        stratVal: x.STRATVAL,
        delivSys: x.DELIVSYS,
        value: x.Value && !isNaN(x.Value) ? +x.Value : null,
        year: x.YEAR,
        // change: x.improvement_cat,
        increased: null,
      };
      return obj;
    });
    const invalids = [];
    transformed
      .filter((x: FinalRaceDatum) => {
        const strat = x.strat.toLowerCase();
        return this.isMatchingStrat(strat);
      })
      .forEach((a) => {
        if (
          isNaN(order.race[a.stratVal]) &&
          isNaN(order.ethnicity[a.stratVal]) &&
          !invalids.includes(a.stratVal)
        ) {
          invalids.push(a.stratVal);
        }
      });
    if (invalids.length) {
      console.warn('invalid stratVals', invalids);
    }
    return transformed
      .filter((x: FinalRaceDatum) => {
        const strat = x.strat.toLowerCase();
        return this.isMatchingStrat(strat);
      })
      .sort((a, b) => {
        const stratA = this.getStrat(a);
        const stratB = this.getStrat(b);
        return order[stratA][a.stratVal] - order[stratB][b.stratVal];
      });
  }

  isMatchingStrat(strat: string): boolean {
    return strat.includes('race') || strat.includes('ethnicity');
  }

  getStrat(x: FinalRaceDatum): string {
    return x.strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
  }
}
