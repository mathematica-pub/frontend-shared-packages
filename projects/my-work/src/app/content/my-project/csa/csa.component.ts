import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
import {
  CsaDatum,
  CsaDotPlotComponent,
} from './csa-dot-plot/csa-dot-plot.component';

@Component({
  selector: 'app-csa',
  standalone: true,
  imports: [CommonModule, ExportContentComponent, CsaDotPlotComponent],
  templateUrl: './csa.component.html',
  styleUrl: './csa.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsaComponent implements OnInit {
  dataPath = 'content/data/Mock_Statistical_Results.csv';
  data$: Observable<CsaDatum[]>;
  rollupData$: Observable<CsaDatum[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const data$ = this.dataService.getDataFile(this.dataPath).pipe(
      filter((data) => data.length > 0),
      map((data) => {
        const transformed: CsaDatum[] = data.map((x) => {
          const obj: CsaDatum = {
            series: 'percentile',
            size: x.County_Size,
            measureCode: x.Measure_Code,
            stratVal: x.StratVal,
            delivSys: x.DelivSys,
            units: x.Units,
            value:
              x.CSA_25 && !isNaN(x.CSA_25) && x.CSA_75 && !isNaN(x.CSA_75)
                ? x.CSA_75 - x.CSA_25
                : null,
            planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
            csa_25: x.CSA_25 && !isNaN(x.CSA_25) ? +x.CSA_25 : null,
            csa_75: x.CSA_75 && !isNaN(x.CSA_75) ? +x.CSA_75 : null,
            plans: [],
          };
          return obj;
        });
        return transformed;
      })
    );

    this.data$ = data$.pipe(
      map((data) =>
        data.filter(
          (x) =>
            x.measureCode === 'AOGX' &&
            x.stratVal === 'Child' &&
            x.delivSys === 'PZIL'
        )
      )
    );
  }
}
