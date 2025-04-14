import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  ChartConfig,
  LinesConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';
import { filter, map, Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: LinesConfig<MonthValue>;
  xAxisConfig: VicXQuantitativeAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
}

class MonthValue {
  month: Date;
  value: number;
}

@Component({
  selector: 'app-staffing-chart',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicLinesModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXQuantitativeAxisModule,
    VicHtmlTooltipModule,
  ],
  providers: [
    VicChartConfigBuilder,
    VicLinesConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
  templateUrl: './staffing-chart.component.html',
  styleUrl: './staffing-chart.component.scss',
})
export class StaffingChartComponent implements OnInit {
  @Input() data$: Observable<MonthValue[]>;
  vm$: Observable<ViewModel>;
  constructor(
    private dataService: DataService,
    private chart: VicChartConfigBuilder,
    private lines: VicLinesConfigBuilder<MonthValue>,
    private xAxisQuantitative: VicXQuantitativeAxisConfigBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    console.log("here");
    this.vm$ = this.dataService.getDataFile(
      'content/data/data.json'
    )
    .pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: MonthValue[]): ViewModel {
    data.forEach((x) => (x.month = new Date(x.month)));
    const chartConfig = this.chart
      .height(300)
      .width(2000)
      .resize({
        height: false,
        width: true,
      })
      .getConfig();

    const xAxisConfig = this.xAxisQuantitative
      .ticks((ticks) => ticks.format('%b').size(0))
      .baseline((baseline) => baseline.display(false))
      .getConfig();

    const yAxisConfig = this.yAxisQuantitative
      .baseline((baseline) => baseline.display(false))
      .ticks((ticks) => ticks.format('.0f').size(0))
      .grid()
      .getConfig();

    const dataConfig = this.lines
      .data(data)
      .xDate((xDate) => xDate.valueAccessor((d) => d.month))
      .y((y) => y.valueAccessor((d) => d.value))
      .getConfig();

    return {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
