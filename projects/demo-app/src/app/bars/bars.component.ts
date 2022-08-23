import { Component, OnInit } from '@angular/core';
import {
  AxisConfig,
  BarsConfig,
  ElementSpacing,
  horizontalBarChartDimensionsConfig,
} from 'projects/viz-components/src/public-api';
import { filter, map, Observable } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/unemployement-data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: BarsConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
}
@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss'],
})
export class BarsComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 36,
    right: 0,
    bottom: 8,
    left: 300,
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: MetroUnemploymentDatum[]): ViewModel {
    const filteredData = data.filter(
      (d) => d.date.getFullYear() === 2008 && d.date.getMonth() === 3
    );
    const xAxisConfig = new AxisConfig();
    xAxisConfig.tickFormat = '.1f';
    const yAxisConfig = new AxisConfig();
    const dataConfig = new BarsConfig();
    dataConfig.data = filteredData;
    dataConfig.dimensions = horizontalBarChartDimensionsConfig;
    dataConfig.ordinal.valueAccessor = (d) => d.division;
    dataConfig.quantitative.valueAccessor = (d) => d.value;
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
