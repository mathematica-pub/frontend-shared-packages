import { Component, OnInit } from '@angular/core';
import { scaleUtc } from 'd3';
import { map, Observable } from 'rxjs';
import { LinesConfig } from 'viz-components';
import { EmploymentDatum } from '../core/models/employement-data';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
})
export class LinesComponent implements OnInit {
  data$: Observable<EmploymentDatum[]>;
  config$: Observable<LinesConfig>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data$ = this.dataService.employmentData$;
    this.config$ = this.data$.pipe(
      map((data) => {
        const config = new LinesConfig();
        config.data = data;
        config.x.valueAccessor = (d) => d.year;
        config.y.valueAccessor = (d) => d.value;
        config.x.scaleType = scaleUtc;
        config.category.valueAccessor = (d) => d.division;
        return config;
      })
    );
  }
}
