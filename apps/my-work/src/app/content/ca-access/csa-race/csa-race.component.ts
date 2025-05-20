/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VicChartConfigBuilder } from '@hsi/viz-components';
import { DataService } from 'apps/my-work/src/app/core/services/data.service';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaAccessChartComponent } from '../ca-access-chart.component';
import { CsaDatum } from '../csa/csa.component';
import { dataPath } from '../data-paths.constants';
import { CsaRaceDotPlotComponent } from './csa-race-dot-plot/csa-race-dot-plot.component';

export interface CsaRaceDatum extends CsaDatum {
  goal: number;
  needsBreakout: boolean;
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
  providers: [VicChartConfigBuilder],
  templateUrl: './csa-race.component.html',
  styleUrl: './csa-race.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CsaRaceComponent extends CaAccessChartComponent {
  override dataPath = dataPath.bda;
  override filters = {
    measureCodes: [],
    delivSyss: [],
    stratVals: [],
  };
  override filterTypes = ['delivSys', 'measureCode', 'stratVal'];

  constructor(dataService: DataService) {
    super(dataService);
  }

  override getTransformedData(data: CsaRaceDatum[]): CsaRaceDatum[] {
    const transformed: CsaRaceDatum[] = data
      .map((x: any) => {
        const obj: CsaRaceDatum = {
          series: 'percentile',
          size: x.County_Size,
          measureCode: x.Measure_Code,
          stratVal: x.StratVal_v2,
          delivSys: x.DelivSys,
          units: x.Units,
          value:
            x.CSA_25 && !isNaN(x.CSA_25) && x.CSA_75 && !isNaN(x.CSA_75)
              ? Math.abs(x.CSA_75 - x.CSA_25)
              : null,
          planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
          percentile25: x.CSA_25 && !isNaN(x.CSA_25) ? +x.CSA_25 : null,
          percentile75: x.CSA_75 && !isNaN(x.CSA_75) ? +x.CSA_75 : null,
          compVal:
            x.BDA_CompVal && !isNaN(x.BDA_CompVal) ? +x.BDA_CompVal : null,
          compValDesc: 'goal',
          directionality: x.Directionality,
          pctBelowComp:
            x.CSA_PctBelowGoal && !isNaN(x.CSA_PctBelowGoal)
              ? +x.CSA_PctBelowGoal
              : null,
          plans: [],
          goal: x.BDA_Goal && !isNaN(x.BDA_Goal) ? +x.BDA_Goal : null,
          needsBreakout: x.Needs_Breakout === 'TRUE',
        };
        return obj;
      })
      .filter((x) => x.needsBreakout);
    return transformed;
  }
}
