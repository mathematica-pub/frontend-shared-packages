/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'apps/my-work/src/app/core/services/data.service';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaAccessChartComponent } from '../ca-access-chart.component';
import { CaDatum } from '../ca-access-stacked-bars.component';
import { CsaRaceDotPlotComponent } from './csa-race-dot-plot/csa-race-dot-plot.component';

export interface CsaDatum extends CaDatum {
  size: string;
  percentile25: number;
  percentile75: number;
}

@Component({
  selector: 'app-csa-race',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    CsaRaceDotPlotComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './csa-race.component.html',
  styleUrl: './csa-race.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CsaRaceComponent extends CaAccessChartComponent {
  override dataPath = 'content/data/Mock_Statistical_Results.csv';
  override filters = {
    measureCodes: [],
    delivSyss: [],
    stratVals: [],
  };
  override filterTypes = ['delivSys', 'measureCode', 'stratVal'];

  constructor(dataService: DataService) {
    super(dataService);
  }

  override getTransformedData(data: CsaDatum[]): CsaDatum[] {
    const transformed: CsaDatum[] = data.map((x: any) => {
      const obj: CsaDatum = {
        series: 'percentile',
        size: x.County_Size,
        measureCode: x.Measure_Code,
        stratVal: x.StratVal,
        delivSys: x.DelivSys,
        units: x.Units,
        value:
          x.CSA_25 && !isNaN(x.CSA_25) && x.CSA_75 && !isNaN(x.CSA_75)
            ? Math.abs(x.CSA_75 - x.CSA_25)
            : null,
        planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
        percentile25: x.CSA_25 && !isNaN(x.CSA_25) ? +x.CSA_25 : null,
        percentile75: x.CSA_75 && !isNaN(x.CSA_75) ? +x.CSA_75 : null,
        compVal: x.CSA_CompVal && !isNaN(x.CSA_CompVal) ? +x.CSA_CompVal : null,
        compValDesc: x.CSA_CompVal_Desc,
        directionality: x.Directionality,
        pctBelowComp:
          x.CSA_PctBelowComp && !isNaN(x.CSA_PctBelowComp)
            ? +x.CSA_PctBelowComp
            : null,
        plans: [],
      };
      return obj;
    });
    return transformed;
  }
}
