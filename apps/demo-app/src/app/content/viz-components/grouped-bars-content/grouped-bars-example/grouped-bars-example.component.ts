import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ChartConfig,
  ElementSpacing,
  GroupedBarsConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicGroupedBarsConfigBuilder,
  VicGroupedBarsModule,
  VicXOrdinalAxisConfigBuilder,
  VicXOrdinalAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
  XOrdinalAxisConfig,
  YQuantitativeAxisConfig,
} from '@hsi/viz-components';
import { IndustryUnemploymentDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { filter, map, Observable } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: GroupedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: XOrdinalAxisConfig<Date>;
  yAxisConfig: YQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-grouped-bars-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicGroupedBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXOrdinalAxisModule,
  ],
  templateUrl: './grouped-bars-example.component.html',
  styleUrl: './grouped-bars-example.component.scss',
  providers: [
    VicChartConfigBuilder,
    VicGroupedBarsConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedBarsExampleComponent implements OnInit {
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
    private chart: VicChartConfigBuilder,
    private groupedBars: VicGroupedBarsConfigBuilder<
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
    const filteredIndustryData = yearlyData.filter(
      (d) => d.industry === 'Government' || d.industry === 'Finance'
    );
    const chartConfig = this.chart
      .margin(this.margin)
      .resize({
        height: false,
      })
      .getConfig();
    const xAxisConfig = this.xAxisOrdinal.tickFormat('%Y').getConfig();
    const yAxisConfig = this.yAxisQuantitative.tickFormat(',.0f').getConfig();
    const dataConfig = this.groupedBars
      .data(filteredIndustryData)
      .vertical((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.date))
          .y((dimension) => dimension.valueAccessor((d) => d.value))
      )
      .color((dimension) => dimension.valueAccessor((d) => d.industry))
      .getConfig();

    return {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
