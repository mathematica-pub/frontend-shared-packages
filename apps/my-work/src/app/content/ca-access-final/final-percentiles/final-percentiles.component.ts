/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VicChartConfigBuilder } from '@mathstack/viz';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { finalDataPath } from '../../ca/data-paths.constants';
import { FinalDatum } from '../final-vertical-stacked-bars.component';
import { FinalPercentilesDotPlotComponent } from './final-percentiles-dot-plot/final-percentiles-dot-plot.component';

export interface FinalPercentilesDatum extends FinalDatum {
  strat: string;
  percentile25: number;
  percentile75: number;
  type: string;
  average: number;
}

@Component({
  selector: 'app-final-percentiles',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    FinalPercentilesDotPlotComponent,
    ReactiveFormsModule,
  ],
  providers: [VicChartConfigBuilder, CaChartService],
  templateUrl: './final-percentiles.component.html',
  styleUrl: './final-percentiles.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FinalPercentilesComponent implements OnInit {
  finalDataPath = finalDataPath.statewide;
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

  getTransformedData(data: FinalPercentilesDatum[]): FinalPercentilesDatum[] {
    const transformed: FinalPercentilesDatum[] = data.map((x: any) => {
      const obj: FinalPercentilesDatum = {
        series: 'percentile',
        year: x.YEAR,
        measureCode: x.MSR,
        strat: x.STRAT,
        stratVal: x.STRATVAL,
        delivSys: x.DELIVSYS,
        units: x.Unit,
        value:
          x.p25 && !isNaN(x.p25) && x.p75 && !isNaN(x.p75)
            ? Math.abs(x.p75 - x.p25)
            : null,
        average:
          x.Center_Value && !isNaN(x.Center_Value) ? +x.Center_Value : null,
        type: x.Center_Value_Type,
        percentile25: x.p25 && !isNaN(x.p25) ? +x.p25 : null,
        percentile75: x.p75 && !isNaN(x.p75) ? +x.p75 : null,
        directionality: x.Directionality,
      };
      return obj;
    });
    return transformed;
  }
}
