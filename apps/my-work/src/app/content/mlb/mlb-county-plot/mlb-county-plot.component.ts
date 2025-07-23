/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { extent } from 'd3';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { CaStackedBarsService } from '../../ca/ca-stacked-bars.service';
import { mlbDataPath } from '../../ca/data-paths.constants';
import { MlbDatum } from '../mlb-stacked-bars.component';
import { lobNames } from '../mlb.constants';
import { MlbCountyPlotDotPlotComponent } from './mlb-county-plot-dot-plot/mlb-county-plot-dot-plot.component';

export interface MlbCountyDatum extends MlbDatum {
  county: string;
  isStateHighest?: boolean;
  isStateLowest?: boolean;
}

@Component({
  selector: 'app-mlb-county-plot',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    MlbCountyPlotDotPlotComponent,
  ],
  providers: [CaChartService, CaStackedBarsService],
  templateUrl: 'mlb-county-plot.component.html',
  styleUrl: './mlb-county-plot.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MlbCountyPlotComponent implements OnInit {
  mlbDataPath = mlbDataPath.lob;
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

  getTransformedData(data: MlbCountyDatum[]): MlbCountyDatum[] {
    const transformed: MlbCountyDatum[] = data
      .map((x: any) => {
        const obj: MlbCountyDatum = {
          series: 'percentile',
          measureCode: x.Measure_Code,
          units: x.Units,
          county: x.County,
          directionality: x.Directionality,
          stratVal: x.StratVal,
          lob: x.LOB,
          comparison: x.Comparison === 'TRUE',
          value: null, // null to avoid bars
          average: x.Value && !isNaN(x.Value) ? +x.Value : null,
          isStateHighest: false,
          isStateLowest: false,
        };
        return obj;
      })
      .filter((x: any) => x.comparison === false && x.average !== null);
    transformed.forEach((x: MlbCountyDatum) => {
      const state = transformed.find(
        (lob) =>
          lob.county === x.county &&
          (lob.lob === lobNames.mock || lob.lob === lobNames.real) &&
          lob.measureCode === x.measureCode &&
          lob.stratVal === x.stratVal
      );
      if (state) {
        const countyRow = transformed.filter(
          (lob) =>
            lob.county === x.county &&
            lob.measureCode === x.measureCode &&
            lob.stratVal === x.stratVal
        );
        const countyExtents = extent(countyRow.map((lob) => lob.average));
        if (countyExtents[0] === state.average) {
          x.isStateLowest = true;
        } else if (countyExtents[1] === state.average) {
          x.isStateHighest = true;
        }
      }
    });
    return transformed;
  }
}
