/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { mlbDataPath } from '../../ca-access/data-paths.constants';
import { CaChartService } from '../../ca/ca-chart.service';
import { MlbDatum } from '../mlb-stacked-bars.component';
import { MlbCountyPlotDotPlotComponent } from './mlb-county-plot-dot-plot/mlb-county-plot-dot-plot.component';

export interface MlbCountyDatum extends MlbDatum {
  county: string;
  range: number;
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
  providers: [CaChartService],
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
    this.caChartService.init(
      this.filters,
      this.filterTypes,
      this.mlbDataPath,
      this.getTransformedData.bind(this)
    );
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
          range: x.Range && !isNaN(x.Range) ? +x.Range : null,
        };
        return obj;
      })
      .filter((x: any) => x.comparison === false && x.average !== null);
    return transformed;
  }
}
