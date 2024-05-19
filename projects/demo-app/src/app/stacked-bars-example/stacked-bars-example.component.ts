import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import {
  VicAxisConfig,
  VicChartModule,
  VicStackedBarsConfig,
  VicStackedBarsModule,
  VicVerticalBarsDimensionsConfig,
  VicXOrdinalAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { Observable, filter, map } from 'rxjs';
import { ComponentDemoComponent } from '../component-demo/component-demo.component';
import { IndustryUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicStackedBarsConfig<IndustryUnemploymentDatum>;
  xAxisConfig: VicAxisConfig;
  yAxisConfig: VicAxisConfig;
}

@Component({
  selector: 'app-stacked-bars-example',
  standalone: true,
  imports: [
    CommonModule,
    ComponentDemoComponent,
    VicChartModule,
    VicStackedBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXOrdinalAxisModule,
  ],
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
    const dataConfig = new VicStackedBarsConfig<IndustryUnemploymentDatum>();
    dataConfig.data = yearlyData;
    dataConfig.dimensions = new VicVerticalBarsDimensionsConfig();
    dataConfig.ordinal.valueAccessor = (d) => d.date;
    dataConfig.quantitative.valueAccessor = (d) => d.value;
    dataConfig.category.valueAccessor = (d) => d.industry;
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
