/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartService } from '../../ca/ca-chart.service';
import { dataPath } from '../../ca/data-paths.constants';
import { IcaDotPlotComponent } from '../ica/ica-dot-plot/ica-dot-plot.component';
import { IcaComponent } from '../ica/ica.component';

@Component({
  selector: 'app-ica-race',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    IcaDotPlotComponent,
    ReactiveFormsModule,
  ],
  providers: [CaChartService],
  templateUrl: './ica-race.component.html',
  styleUrl: './../ica/ica.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IcaRaceComponent extends IcaComponent {
  override dataPath = dataPath.bda;

  override getStratVal(x: any): string {
    return x.StratVal_v2;
  }
}
