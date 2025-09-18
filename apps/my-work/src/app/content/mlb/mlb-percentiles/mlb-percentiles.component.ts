/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VicChartConfigBuilder } from '@hsi/viz-components';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { mlbDataPath } from '../../ca/data-paths.constants';
import { MlbDatum } from '../mlb-stacked-bars.component';
import { MlbPercentilesDotPlotComponent } from './mlb-percentiles-dot-plot/mlb-percentiles-dot-plot.component';

export interface MlbPercentilesDatum extends MlbDatum {
  strat: string;
  percentile25: number;
  percentile75: number;
  type: string;
}

@Component({
  selector: 'app-mlb-percentiles',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    MlbPercentilesDotPlotComponent,
    ReactiveFormsModule,
  ],
  providers: [VicChartConfigBuilder, CaChartService],
  templateUrl: './mlb-percentiles.component.html',
  styleUrl: './mlb-percentiles.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MlbPercentilesComponent implements OnInit {
  mlbDataPath = mlbDataPath.mlb;
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
      dataPath: this.mlbDataPath,
      getTransformedData: this.getTransformedData.bind(this),
    };
    this.caChartService.init(caChartDataConfig);
  }

  getTransformedData(data: MlbPercentilesDatum[]): MlbPercentilesDatum[] {
    const transformed: MlbPercentilesDatum[] = data.map((x: any) => {
      const obj: MlbPercentilesDatum = {
        series: 'percentile',
        lob: x.LOB,
        comparison: x.Comparison === 'TRUE',
        measureCode: x.Measure_Code,
        strat: x.STRAT,
        stratVal: x.StratVal_v2,
        units: x.Units,
        value:
          x.MLB_25 && !isNaN(x.MLB_25) && x.MLB_75 && !isNaN(x.MLB_75)
            ? Math.abs(x.MLB_75 - x.MLB_25)
            : null,
        average: x.Value && !isNaN(x.Value) ? +x.Value : null,
        type: x.Type,
        percentile25: x.MLB_25 && !isNaN(x.MLB_25) ? +x.MLB_25 : null,
        percentile75: x.MLB_75 && !isNaN(x.MLB_75) ? +x.MLB_75 : null,
        directionality: x.Directionality,
      };
      return obj;
    });
    return transformed.filter((x: MlbPercentilesDatum) => {
      return x.strat === 'NULL' && x.comparison === false;
    });
  }
}
