/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { finalDataPath } from '../../ca/data-paths.constants';
import { FinalDatum } from '../final-vertical-stacked-bars.component';
import { FinalArrowComponent } from './final-arrow/final-arrow.component';

export interface FinalCountyDatum extends FinalDatum {
  county: string;
  change: string;
  year: string;
  increased: boolean;
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
  finalDataPath = finalDataPath.county;
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
        stratVal: x.StratVal,
        average: null,
        value: x.Value && !isNaN(x.Value) ? +x.Value : null,
        year: x.Year,
        change: x.Change,
        increased: null,
      };
      return obj;
    });
    return transformed;
  }
}
