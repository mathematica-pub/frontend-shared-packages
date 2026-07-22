/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { finalDataPath } from '../../ca/data-paths.constants';
import { FinalMLRGroupedComponent } from './final-mlr-grouped/final-mlr-grouped.component';

export interface FinalMlrDatum {
  series: string;
  delivSys: string;
  year: string;
  value: number;
  average: number;
  percentile25: number;
  percentile75: number;
  compliance: boolean;
  group: string;
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
  };
  filterTypes = ['delivSys'];

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
        delivSys: x.delivSys,
        year: x.year,
        value:
          x.p25 && !isNaN(x.p25) && x.p75 && !isNaN(x.p75)
            ? Math.abs(x.p75 - x.p25)
            : null,
        average: x.mean && !isNaN(x.mean) ? +x.mean : null,
        percentile25: x.p25 && !isNaN(x.p25) ? +x.p25 : null,
        percentile75: x.p75 && !isNaN(x.p75) ? +x.p75 : null,
        compliance: x.group === 'compliance_yes',
        group: x.group,
      };
      return obj;
    });
    return transformed.filter(
      (x) =>
        x.year !== 'all years' && x.group !== 'overall' && x.average !== null
    );
  }
}
