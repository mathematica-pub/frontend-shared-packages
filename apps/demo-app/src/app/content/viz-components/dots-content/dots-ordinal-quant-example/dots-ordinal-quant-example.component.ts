import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DotsConfig,
  ElementSpacing,
  VicChartModule,
  VicDotsConfigBuilder,
  VicDotsModule,
  VicOrdinalAxisConfig,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';

interface Datum {
  value: number;
  location: string;
  category: string;
}

interface ViewModel {
  dataConfig: DotsConfig<Datum>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<number>;
}

const data: Datum[] = [
  { location: 'Nevada', category: 'D', value: 0.49 },
  { location: 'Nevada', category: 'R', value: 0.46 },
  { location: 'North Carolina', category: 'D', value: 0.48 },
  { location: 'North Carolina', category: 'R', value: 0.46 },
  { location: 'Wisconsin', category: 'D', value: 0.49 },
  { location: 'Wisconsin', category: 'R', value: 0.47 },
  { location: 'Georgia', category: 'D', value: 0.48 },
  { location: 'Georgia', category: 'R', value: 0.47 },
  { location: 'Pennsylvania', category: 'D', value: 0.48 },
  { location: 'Pennsylvania', category: 'R', value: 0.48 },
  { location: 'Michigan', category: 'D', value: 0.47 },
  { location: 'Michigan', category: 'R', value: 0.47 },
  { location: 'Arizona', category: 'D', value: 0.45 },
  { location: 'Arizona', category: 'R', value: 0.49 },
];

@Component({
  selector: 'app-dots-ordinal-quant-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicDotsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
  ],
  templateUrl: './dots-ordinal-quant-example.component.html',
  styleUrl: './dots-ordinal-quant-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VicDotsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
})
export class DotsOrdinalQuantExampleComponent implements OnInit {
  vm: ViewModel;
  margin: ElementSpacing = {
    top: 0,
    right: 0,
    bottom: 24,
    left: 80,
  };

  constructor(
    private dots: VicDotsConfigBuilder<Datum>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    this.getViewModel();
  }

  getViewModel(): void {
    const xAxisConfig = this.xQuantitativeAxis
      .tickFormat('.0%')
      .removeDomainLine()
      .removeTickMarks()
      .numTicks(5)
      .getConfig();
    const yAxisConfig = this.yOrdinalAxis
      .removeDomainLine()
      .removeTickMarks()
      .getConfig();

    const dataConfig = this.dots
      .data(data)
      .opacity(0.8)
      .xNumeric((x) =>
        x
          .valueAccessor((d) => d.value)
          .domain([0.42, 0.52])
          .includeZeroInDomain(false)
      )
      .yOrdinal((y) => y.valueAccessor((d) => d.location))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.category).range(['royalblue', 'red'])
      )
      .radius(5)
      .getConfig();

    this.vm = {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
