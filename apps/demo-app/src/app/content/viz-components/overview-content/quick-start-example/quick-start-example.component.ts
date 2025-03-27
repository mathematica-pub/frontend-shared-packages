import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  BarsConfig,
  ChartConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';

export interface MetroUnemploymentDatum {
  division: string;
  date: Date;
  value: number;
}

@Component({
  selector: 'app-quick-start-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicXyChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
  ],
  providers: [
    VicChartConfigBuilder,
    VicBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
  templateUrl: './quick-start-example.component.html',
  styleUrl: './quick-start-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class QuickStartExampleComponent implements OnInit {
  @Input() data: MetroUnemploymentDatum[];
  chartConfig: ChartConfig;
  barsConfig: BarsConfig<MetroUnemploymentDatum, string>;
  xAxisConfig: VicXQuantitativeAxisConfig<number>;
  yAxisConfig: VicYOrdinalAxisConfig<string>;

  constructor(
    private chart: VicChartConfigBuilder,
    private bars: VicBarsConfigBuilder<MetroUnemploymentDatum, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit() {
    this.chartConfig = this.chart
      .margin({ top: 24, right: 24, bottom: 24, left: 160 })
      .getConfig();
    this.barsConfig = this.bars
      .data(this.data)
      .horizontal((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.value))
          .y((dimension) => dimension.valueAccessor((d) => d.division))
      )
      .color((dimension) => dimension.range(['teal']))
      .getConfig();

    this.xAxisConfig = this.xQuantitativeAxis.getConfig();
    this.yAxisConfig = this.yOrdinalAxis
      .ticks((ticks) =>
        ticks.wrap((wrap) =>
          wrap.width(140).maintainYPosition(true).maintainXPosition(true)
        )
      )
      .getConfig();
  }
}
