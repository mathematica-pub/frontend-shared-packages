import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
import { AciCountyBarComponent } from './aci-county-bar/aci-county-bar.component';
import { AciCountyMapComponent } from './aci-county-map/aci-county-map.component';

export interface ACICountyDatum {
  stateFp: string;
  countyName: string;
  stateName: string;
  countyFips: string;
  monthCode: string;
  year: string;
  ACIOverall: number | null;
  extremeWeatherPayments: number | null;
  extremeWeatherPaymentsPerBeneficiary: number | null;
  count: number;
}

@Component({
  selector: 'app-aci-county',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    AciCountyBarComponent,
    AciCountyMapComponent,
  ],
  templateUrl: './aci-county.component.html',
  styleUrls: ['./aci-county.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AciCountyComponent implements OnInit {
  dataPath = 'content/example-data/CLIMATE_CMS_national.csv';
  allData$: Observable<ACICountyDatum[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.createData();
    console.log(this.allData$);
  }

  createData(): void {
    const data$ = this.dataService.getDataFile(this.dataPath).pipe(
      map((data) => {
        console.log(data);
        const transformed: ACICountyDatum[] = data.reduce(
          (acc, x) => {
            const key: string = x.STATEFP + x.FIPS + '-' + x.YEAR;
            acc[key] ||= {
              stateFp: x.STATEFP,
              countyName: x.COUNTY_NAME,
              stateName: x.STATE_NAME,
              countyFips: x.FIPS,
              monthCode: x.MONTH,
              ACIOverall: parseFloat(x.ACI_OVERALL),
              year: x.YEAR,
              extremeWeatherPayments: parseFloat(x.EXTREME_WEATHER_PAYMENTS),
              extremeWeatherPaymentsPerBeneficiary:
                x.EXTREME_WEATHER_PAYMENTS_PER_BENEFICIARY,
              count: 0,
            } as ACICountyDatum;

            acc[key].count++;
            acc[key].extremeWeatherPayments += parseFloat(
              x.EXTREME_WEATHER_PAYMENTS
            );
            acc[key].extremeWeatherPaymentsPerBeneficiary += parseFloat(
              x.EXTREME_WEATHER_PAYMENTS_PER_BENEFICIARY
            );
            acc[key].ACIOverall += parseFloat(x.ACI_OVERALL);

            return acc;
          },
          {} as { [key: string]: ACICountyDatum }
        );

        const result = Object.values(transformed).map((x) => {
          x.ACIOverall /= x.count;
          return x;
        });

        return result;
      })
    );

    this.allData$ = data$.pipe(
      map((data) => data.filter((d) => d.year === '2023'))
    );
  }
}
