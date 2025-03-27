import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ChartConfig,
  DotsConfig,
  ElementSpacing,
  VicChartConfigBuilder,
  VicChartModule,
  VicDotsConfigBuilder,
  VicDotsModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';

interface Datum {
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: DotsConfig<Datum>;
  xAxisConfig: VicXQuantitativeAxisConfig<number>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
}

const data: Datum[] = [
  { x: 1, y: 6, radius: 4, color: 'teal' },
  { x: 2, y: 2, radius: 3, color: 'purple' },
  { x: 1, y: 1, radius: 4, color: 'purple' },
  { x: 4, y: 2, radius: 7, color: 'teal' },
  { x: 5, y: 2, radius: 6, color: 'teal' },
  { x: 6, y: 5, radius: 4, color: 'purple' },
];

@Component({
  selector: 'app-dots-scatterplot-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicDotsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
  ],
  templateUrl: './dots-scatterplot-example.component.html',
  styleUrl: './dots-scatterplot-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VicChartConfigBuilder,
    VicDotsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
  ],
})
export class DotsScatterplotExampleComponent implements OnInit {
  @Input() xAxisConfig: VicXQuantitativeAxisConfig<number>;
  @Input() yAxisConfig: VicYQuantitativeAxisConfig<number>;
  vm: ViewModel;
  margin: ElementSpacing = {
    top: 0,
    right: 0,
    bottom: 32,
    left: 30,
  };

  constructor(
    private chart: VicChartConfigBuilder,
    private dots: VicDotsConfigBuilder<Datum>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    this.getViewModel();
  }

  getViewModel(): void {
    const chartConfig = this.chart
      .margin(this.margin)
      .height(160)
      .width(160)
      .resize({ height: false })
      .getConfig();

    let xAxisConfig: VicXQuantitativeAxisConfig<number>;
    let yAxisConfig: VicYQuantitativeAxisConfig<number>;
    if (this.xAxisConfig) {
      xAxisConfig = this.xAxisConfig;
    } else {
      xAxisConfig = this.xQuantitativeAxis
        .ticks((ticks) => ticks.format('.0f'))
        .getConfig();
    }
    if (this.yAxisConfig) {
      yAxisConfig = this.yAxisConfig;
    } else {
      yAxisConfig = this.yQuantitativeAxis
        .ticks((ticks) => ticks.format('.0f'))
        .getConfig();
    }

    const dataConfig = this.dots
      .data(data)
      .mixBlendMode('multiply')
      .xNumeric((x) => x.valueAccessor((d) => d.x).domain([0, 7]))
      .yNumeric((y) => y.valueAccessor((d) => d.y).domain([0, 7]))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.color).range(['teal', 'purple'])
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.radius).range([2, 7])
      )
      .getConfig();

    this.vm = {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
