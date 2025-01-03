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
import {
  LocationCategoryDatum,
  statesElectionData,
} from '../../data/location-category-data';

interface ViewModel {
  dataConfig: DotsConfig<LocationCategoryDatum>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<number>;
}

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
    bottom: 40,
    left: 80,
  };

  constructor(
    private dots: VicDotsConfigBuilder<LocationCategoryDatum>,
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
      .data(statesElectionData)
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
