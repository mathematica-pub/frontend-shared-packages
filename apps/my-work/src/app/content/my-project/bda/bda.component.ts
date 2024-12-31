/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { DataService } from '../../../core/services/data.service';
import { CaAccessChartComponent } from '../ca-access-chart.component';
import { CaDatum } from '../ca-access-stacked-bars.component';
import { BdaDotPlotComponent } from './bda-dot-plot/bda-dot-plot.component';

export interface BdaDatum extends CaDatum {
  goal: number;
  strat: string;
}

@Component({
  selector: 'app-bda',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    BdaDotPlotComponent,
  ],
  templateUrl: 'bda.component.html',
  styleUrl: './bda.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BdaComponent extends CaAccessChartComponent {
  override dataPath = 'content/data/Mock_BDA_Results.csv';
  override filters = {
    measureCodes: [],
    delivSyss: [],
  };
  override filterTypes = ['delivSys', 'measureCode'];

  constructor(dataService: DataService) {
    super(dataService);
  }

  override getTransformedData(data: BdaDatum[]): BdaDatum[] {
    const transformed: BdaDatum[] = data.map((x: any) => {
      const obj: BdaDatum = {
        series: 'percentile',
        measureCode: x.Measure_Code,
        delivSys: x.DelivSys,
        units: x.Units,
        value: x.BDA_Goal && !isNaN(x.BDA_Goal) ? +x.BDA_Goal : null,
        planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
        compVal: x.BDA_CompVal && !isNaN(x.BDA_CompVal) ? +x.BDA_CompVal : null,
        compValDesc: x.BDA_CompVal_Desc,
        directionality: x.Directionality,
        pctBelowComp:
          x.BDA_PctBelowGoal && !isNaN(x.BDA_PctBelowGoal)
            ? +x.BDA_PctBelowGoal
            : null,
        goal: x.BDA_Goal && !isNaN(x.BDA_Goal) ? +x.BDA_Goal : null,
        strat: x.STRAT,
        stratVal: x.StratVal_v2,
        plans: [],
      };
      return obj;
    });
    return transformed;
  }
}
