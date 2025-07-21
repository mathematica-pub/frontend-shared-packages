import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartService } from '../../ca/ca-chart.service';
import { CaStackedBarsService } from '../../ca/ca-stacked-bars.service';
import { MlbBdaDotPlotComponent } from '../mlb-bda/mlb-bda-dot-plot/mlb-bda-dot-plot.component';
import { MlbBdaComponent } from '../mlb-bda/mlb-bda.component';

@Component({
  selector: 'app-mlb-shortage',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    MlbBdaDotPlotComponent,
  ],
  providers: [CaChartService, CaStackedBarsService],
  templateUrl: '../mlb-bda/mlb-bda.component.html',
  styleUrl: '../mlb-bda/mlb-bda.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MlbShortageComponent extends MlbBdaComponent {
  override chartName = 'Provider Shortage';

  override isMatchingStrat(strat: string): boolean {
    return strat.includes('shortage');
  }
}
