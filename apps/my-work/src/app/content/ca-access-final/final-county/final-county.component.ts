/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { finalDataPath } from '../../ca/data-paths.constants';
import { FinalRaceDatum } from '../final-race/final-race.component';
import { FinalArrowComponent } from './final-arrow/final-arrow.component';

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
    FinalArrowComponent,
  ],
  providers: [CaChartService],
  templateUrl: 'final-county.component.html',
  styleUrl: './final-county.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FinalCountyComponent implements OnInit {
  chartName = 'Final County Chart';
  finalDataPath = finalDataPath.county;
  filters = {
    delivSyss: [],
    measureCodes: [],
    stratVals: [],
  };
  filterTypes = ['delivSys', 'measureCode', 'stratVal'];

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
        measureCode: x.MSR,
        units: x.Unit,
        county: x.Region,
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
    return transformed;
  }
}
