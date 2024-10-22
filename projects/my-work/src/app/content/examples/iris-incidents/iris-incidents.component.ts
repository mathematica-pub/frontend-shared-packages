import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
import { IrisIncidentsByLmeAndYearComponent } from './iris-incidents-by-lme-and-year/iris-incidents-by-lme-and-year.component';

export interface IrisIncident {
  year: number;
  lme: string;
  incidentType: string;
  incidentSubtype: string;
}
@Component({
  selector: 'app-iris-incidents',
  standalone: true,
  imports: [
    CommonModule,
    IrisIncidentsByLmeAndYearComponent,
    ExportContentComponent,
  ],
  templateUrl: './iris-incidents.component.html',
  styleUrl: './iris-incidents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IrisIncidentsComponent implements OnInit {
  dataPath = 'content/example-data/iris-incidents.csv';
  data$: Observable<IrisIncident[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.createData();
  }

  createData(): void {
    this.dataService
      .getDataFile(this.dataPath)
      .pipe(
        map((data) => {
          return data.map((d: any) => {
            return {
              year: Number(d.SFY),
              lme: d.LME,
              incidentType: d.INCIDENTTYPE,
              incidentSubtype: d.SUBTYPE,
            } as IrisIncident;
          });
        })
      )
      .subscribe((d) => console.log(d));
  }
}
