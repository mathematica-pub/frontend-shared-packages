import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  VicAxisConfig,
  VicChartModule,
  VicElementSpacing,
  VicStackedBarsConfig,
  VicStackedBarsModule,
  VicVerticalBarsDimensionsConfig,
  VicXOrdinalAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../../../core/models/data';
import { DataService } from '../../../core/services/data.service';

interface ViewModel {
  dataConfig: VicStackedBarsConfig<IndustryUnemploymentDatum>;
  xAxisConfig: VicAxisConfig;
  yAxisConfig: VicAxisConfig;
}

@Component({
  selector: 'app-basic-stacked-bars',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicStackedBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXOrdinalAxisModule,
  ],
  templateUrl: './basic-stacked-bars.component.html',
  styleUrls: ['./basic-stacked-bars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicStackedBarsComponent {
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
