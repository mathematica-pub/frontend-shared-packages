import { Component, OnInit } from '@angular/core';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import {
  VicAxisConfig,
  VicStackedAreaConfig,
} from 'projects/viz-components/src/public-api';
import { Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicStackedAreaConfig<IndustryUnemploymentDatum>;
  xAxisConfig: VicAxisConfig;
  yAxisConfig: VicAxisConfig;
}

@Component({
  selector: 'app-stacked-area-example',
  templateUrl: './stacked-area-example.component.html',
  styleUrls: ['./stacked-area-example.component.scss'],
})
export class StackedAreaExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: VicElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-area-example';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const xAxisConfig = new VicAxisConfig();
    xAxisConfig.tickFormat = '%Y';
    const yAxisConfig = new VicAxisConfig();
    yAxisConfig.tickFormat = ',.0f';
    const dataConfig = new VicStackedAreaConfig<IndustryUnemploymentDatum>();
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
