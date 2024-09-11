import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IndustryUnemploymentDatum } from 'projects/demo-app/src/app/core/models/data';
import { DataService } from 'projects/demo-app/src/app/core/services/data.service';
import { XOrdinalAxisConfig } from 'projects/viz-components/src/lib/axes/x-ordinal/x-ordinal-axis-config';
import { YQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/y-quantitative-axis/y-quantitative-axis-config';
import { ElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { VicStackedBarsConfigBuilder } from 'projects/viz-components/src/lib/stacked-bars/config/stacked-bars-builder';
import { StackedBarsConfig } from 'projects/viz-components/src/lib/stacked-bars/config/stacked-bars-config';
import {
  VicChartModule,
  VicStackedBarsModule,
  VicXOrdinalAxisConfigBuilder,
  VicXOrdinalAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { Observable, filter, map } from 'rxjs';

interface ViewModel {
  dataConfig: StackedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: XOrdinalAxisConfig<Date>;
  yAxisConfig: YQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-bars-example',
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
  templateUrl: './stacked-bars-example.component.html',
  styleUrls: ['./stacked-bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    VicStackedBarsConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
  ],
})
export class StackedBarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-bars-example';

  constructor(
    private dataService: DataService,
    private stackedBars: VicStackedBarsConfigBuilder<
      IndustryUnemploymentDatum,
      Date
    >,
    private xAxisOrdinal: VicXOrdinalAxisConfigBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisConfigBuilder<number>
  ) {}

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
    const xAxisConfig = this.xAxisOrdinal.tickFormat('%Y').getConfig();
    const yAxisConfig = this.yAxisQuantitative.tickFormat(',.0f').getConfig();
    const dataConfig = this.stackedBars
      .data(yearlyData)
      .orientation('vertical')
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.date)
      )
      .createQuantitativeDimension((dimension) =>
        dimension.valueAccessor((d) => d.value)
      )
      .createCategoricalDimension((dimension) =>
        dimension.valueAccessor((d) => d.industry)
      )
      .getConfig();

    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
