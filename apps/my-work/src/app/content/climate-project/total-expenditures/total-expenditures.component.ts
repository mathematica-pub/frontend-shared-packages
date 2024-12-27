import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
import { TotalExpendituresBarComponent } from './total-expenditures-bar/total-expenditures-bar.component';

export interface TotalExpendituresDatum {
  type: string;
  year: string;
  extreme_weather_payments: number | null;
  extreme_weather_payments_per_beneficiary: number | null;
}

@Component({
  selector: 'app-expend',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    TotalExpendituresBarComponent,
  ],
  templateUrl: './total-expenditures.component.html',
  styleUrls: ['./total-expenditures.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalExpendituresComponent implements OnInit {
  dataPath = 'content/example-data/aggregated_ewp_data.csv';
  barsData$: Observable<TotalExpendituresDatum[]>;
  linesData$: Observable<TotalExpendituresDatum[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.createData();
  }

  createData(): void {
    console.log('File Path: ', this.dataPath);
    const data$ = this.dataService.getDataFile(this.dataPath).pipe(
      map((data) => {
        const transformed: TotalExpendituresDatum[] = data.map((x) => {
          const obj: TotalExpendituresDatum = {
            type: x.TYPE,
            year: x.YEAR,
            extreme_weather_payments: parseFloat(x.EXTREME_WEATHER_PAYMENTS),
            extreme_weather_payments_per_beneficiary:
              x.EXTREME_WEATHER_PAYMENTS_PER_BENEFICIARY,
          };
          return obj;
        });
        return transformed;
      })
    );

    this.barsData$ = data$.pipe(
      map((data) => data.filter((d) => d.year === '2023'))
    );
  }
}
