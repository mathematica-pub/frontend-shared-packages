import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DotsConfig,
  ElementSpacing,
  VicChartModule,
  VicDotsConfigBuilder,
  VicDotsModule,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
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
  dataConfig: DotsConfig<Datum>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
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
    VicDotsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
  ],
})
export class DotsScatterplotExampleComponent implements OnInit {
  vm: ViewModel;
  margin: ElementSpacing = {
    top: 0,
    right: 0,
    bottom: 24,
    left: 24,
  };

  constructor(
    private dots: VicDotsConfigBuilder<Datum>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    this.getViewModel();
  }

  getViewModel(): void {
    const xAxisConfig = this.xQuantitativeAxis.tickFormat('.0f').getConfig();
    const yAxisConfig = this.yQuantitativeAxis.tickFormat('.0f').getConfig();

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
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
