import { Component, OnInit } from '@angular/core';
import {
  AxisConfig,
  ElementSpacing,
  LinesConfig,
} from 'projects/viz-components/src/public-api';
import { filter, map, Observable } from 'rxjs';
import { DocumentationType } from '../core/enums/documentation.enums';
import { MetroUnemploymentDatum } from '../core/models/unemployement-data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: LinesConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
}
@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
})
export class LinesComponent implements OnInit {
  linesDocumentation = DocumentationType.Lines;
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: MetroUnemploymentDatum[]): ViewModel {
    const xAxisConfig = new AxisConfig();
    xAxisConfig.tickFormat = '%Y';
    const yAxisConfig = new AxisConfig();
    const dataConfig = new LinesConfig();
    dataConfig.data = data;
    dataConfig.x.valueAccessor = (d) => d.date;
    dataConfig.y.valueAccessor = (d) => d.value;
    dataConfig.category.valueAccessor = (d) => d.division;
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
