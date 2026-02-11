/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VicChartConfigBuilder } from '@mathstack/viz';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { finalDataPath } from '../../ca/data-paths.constants';
import { FinalPlansCirclePackComponent } from './final-plans-circle-pack/final-plans-circle-pack.component';

export interface FinalPlansDatum {
  measureCode: string;
  strat: string;
  stratVal: string;
  size: number;
  change: string;
}

@Component({
  selector: 'app-final-plans',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    FinalPlansCirclePackComponent,
    ReactiveFormsModule,
  ],
  providers: [VicChartConfigBuilder, CaChartService],
  templateUrl: './final-plans.component.html',
  styleUrl: './final-plans.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FinalPlansComponent implements OnInit {
  finalDataPath = finalDataPath.plan;
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

  getTransformedData(data: FinalPlansDatum[]): FinalPlansDatum[] {
    const transformed: FinalPlansDatum[] = data.map((x: any) => {
      const obj: FinalPlansDatum = {
        measureCode: x.Measure_Code,
        strat: x.STRAT,
        stratVal: x.StratVal,
        size: x.Size && !isNaN(x.Size) ? +x.Size : null,
        change: x.Change,
      };
      return obj;
    });
    return transformed;
  }
}
