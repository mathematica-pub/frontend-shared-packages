/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { finalDataPath } from '../../ca/data-paths.constants';
import { FinalPercentilesDatum } from '../final-percentiles/final-percentiles.component';
import { FinalMLRGroupedComponent } from './final-mlr-grouped/final-mlr-grouped.component';

export interface FinalMlrDatum extends FinalPercentilesDatum {
  compliance: boolean;
  delivSys: string;
}

@Component({
  selector: 'app-final-mlr',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    FinalMLRGroupedComponent,
    ReactiveFormsModule,
  ],
  providers: [CaChartService],
  templateUrl: './final-mlr.component.html',
  styleUrl: './final-mlr.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FinalMlrComponent implements OnInit {
  finalDataPath = finalDataPath.mlr;
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

  getTransformedData(data: FinalMlrDatum[]): FinalMlrDatum[] {
    const transformed: FinalMlrDatum[] = data.map((x: any) => {
      const obj: FinalMlrDatum = {
        series: 'percentile',
        delivSys: x.DelivSys,
        year: x.Year,
        measureCode: x.Measure_Code,
        strat: x.STRAT,
        stratVal: x.StratVal_v2,
        units: x.Units,
        value:
          x.Final_25 && !isNaN(x.Final_25) && x.Final_75 && !isNaN(x.Final_75)
            ? Math.abs(x.Final_75 - x.Final_25)
            : null,
        average: x.Value && !isNaN(x.Value) ? +x.Value : null,
        type: x.Type,
        percentile25: x.Final_25 && !isNaN(x.Final_25) ? +x.Final_25 : null,
        percentile75: x.Final_75 && !isNaN(x.Final_75) ? +x.Final_75 : null,
        directionality: x.Directionality,
        compliance: x.Compliance === 'Yes',
      };
      return obj;
    });
    return transformed.filter((x: FinalMlrDatum) => x.strat === 'NULL');
  }
}
