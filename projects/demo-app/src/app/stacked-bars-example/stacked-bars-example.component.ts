import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VicVerticalBarsDimensions } from 'projects/viz-components/src/lib/bars/bars-dimensions';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import {
  VicAxisConfig,
  VicStackedBarsConfig,
} from 'projects/viz-components/src/public-api';
import { Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicStackedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: VicAxisConfig;
  yAxisConfig: VicAxisConfig;
}

@Component({
  selector: 'app-stacked-bars-example',
  templateUrl: './stacked-bars-example.component.html',
  styleUrls: ['./stacked-bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StackedBarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: VicElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-bars-example';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const yearlyData = data.filter(
      (d) => d.date.getUTCDate() === 1 && d.date.getUTCMonth() === 0
    );
    const xAxisConfig = new VicAxisConfig();
    xAxisConfig.tickFormat = '%Y';
    const yAxisConfig = new VicAxisConfig();
    yAxisConfig.tickFormat = ',.0f';
    const dataConfig = new VicStackedBarsConfig<
      IndustryUnemploymentDatum,
      Date
    >();
    dataConfig.data = yearlyData;
    dataConfig.dimensions = new VicVerticalBarsDimensions();
    dataConfig.ordinal.valueAccessor = (d) => d.date;
    dataConfig.quantitative.valueAccessor = (d) => d.value;
    dataConfig.categorical.valueAccessor = (d) => d.industry;
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
