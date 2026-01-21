import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartService } from '../../ca/ca-chart.service';
import { CaStackedBarsService } from '../../ca/ca-stacked-bars.service';
import { MlbRaceEthnicityDotPlotComponent } from '../mlb-race-ethnicity/mlb-race-ethnicity-dot-plot/mlb-race-ethnicity-dot-plot.component';
import { MlbRaceEthnicityComponent } from '../mlb-race-ethnicity/mlb-race-ethnicity.component';

@Component({
  selector: 'app-mlb-shortage',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    MlbRaceEthnicityDotPlotComponent,
  ],
  providers: [CaChartService, CaStackedBarsService],
  templateUrl: '../mlb-race-ethnicity/mlb-race-ethnicity.component.html',
  styleUrl: '../mlb-race-ethnicity/mlb-race-ethnicity.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MlbShortageComponent extends MlbRaceEthnicityComponent {
  override chartName = 'Provider Shortage';

  override isMatchingStrat(strat: string): boolean {
    return strat.includes('shortage');
  }
}
