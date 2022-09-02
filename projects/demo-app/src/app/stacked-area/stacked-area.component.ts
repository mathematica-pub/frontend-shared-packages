import { Component, OnInit } from '@angular/core';
import {
  AxisConfig,
  ElementSpacing,
  StackedAreaConfig,
} from 'projects/viz-components/src/public-api';
import { filter, map, Observable } from 'rxjs';
import { Documentation } from '../core/enums/documentation.enums';
import { IndustryUnemploymentDatum } from '../core/models/unemployement-data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: StackedAreaConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
}

@Component({
  selector: 'app-stacked-area',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss'],
})
export class StackedAreaComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const xAxisConfig = new AxisConfig();
    xAxisConfig.tickFormat = '%Y';
    const yAxisConfig = new AxisConfig();
    const dataConfig = new StackedAreaConfig();
    dataConfig.data = data;
    dataConfig.x.valueAccessor = (d) => d.date;
    dataConfig.y.valueAccessor = (d) => d.value;
    dataConfig.category.valueAccessor = (d) => d.industry;
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
