import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
import { EnergyIntensityBarComponent } from './energy-intensity-bar/energy-intensity-bar.component';

export interface EnergyIntensityDatum {
  name: string;
  category: string;
  geography: string;
  units: string;
  date: Date;
  value: number | null;
}

@Component({
  selector: 'app-energy-intensity',
  standalone: true,
  imports: [CommonModule, ExportContentComponent, EnergyIntensityBarComponent],
  templateUrl: './energy-intensity.component.html',
  styleUrls: ['./energy-intensity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyIntensityComponent implements OnInit {
  dataPath = 'content/example-data/energy-intensity-data.csv';
  barsData$: Observable<EnergyIntensityDatum[]>;
  linesData$: Observable<EnergyIntensityDatum[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.createData();
  }

  createData(): void {
    const data$ = this.dataService.getDataFile(this.dataPath).pipe(
      map((data) => {
        const transformed: EnergyIntensityDatum[] = data.map((x) => {
          const obj: EnergyIntensityDatum = {
            category: x.category,
            geography: x.geography,
            date: new Date(x.date),
            units: x.units,
            name: x.name,
            value: x.value && !isNaN(x.value) ? +x.value : null,
          };
          return obj;
        });
        return transformed;
      })
    );

    this.barsData$ = data$.pipe(
      map((data) => data.filter((d) => d.date.getFullYear() === 2020))
    );
  }
}
