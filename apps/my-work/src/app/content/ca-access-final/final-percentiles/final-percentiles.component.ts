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

  getTransformedData(data: FinalPercentilesDatum[]): FinalPercentilesDatum[] {
    const transformed: FinalPercentilesDatum[] = data.map((x: any) => {
      const obj: FinalPercentilesDatum = {
        series: 'percentile',
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
      };
      return obj;
    });
    return transformed.filter((x: FinalPercentilesDatum) => x.strat === 'NULL');
  }
}
