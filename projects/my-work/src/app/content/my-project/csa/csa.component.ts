import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
import { EnergyIntensityDatum } from '../../examples/energy-intensity/energy-intensity.component';
import { CsaDotPlotComponent } from './csa-dot-plot/csa-dot-plot.component';

@Component({
  selector: 'app-csa',
  standalone: true,
  imports: [CommonModule, ExportContentComponent, CsaDotPlotComponent],
  templateUrl: './csa.component.html',
  styleUrl: './csa.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsaComponent implements OnInit {
  dataPath = 'content/example-data/energy-intensity-data.csv';
  data$: Observable<EnergyIntensityDatum[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
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

    this.data$ = data$.pipe(
      map((data) => data.filter((d) => d.date.getFullYear() === 2020))
    );
  }
}
