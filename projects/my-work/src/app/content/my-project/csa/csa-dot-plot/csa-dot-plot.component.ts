import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  StackedBarsConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicOrdinalAxisConfig,
  VicQuantitativeAxisConfig,
  VicStackedBarsConfigBuilder,
  VicStackedBarsModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';
import { max } from 'd3';
import { EnergyIntensityDatum } from '../../../examples/energy-intensity/energy-intensity.component';

@Component({
  selector: 'app-csa-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicXyChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicXyBackgroundModule,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
  templateUrl: './csa-dot-plot.component.html',
  styleUrl: './csa-dot-plot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsaDotPlotComponent implements OnInit {
  @Input() data: EnergyIntensityDatum[];
  filteredDataConfig: StackedBarsConfig<EnergyIntensityDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string>;
  perCap = 'Energy consumption per capita';
  sortVar = this.perCap;
  chartHeight = 600;

  constructor(
    private bars: VicStackedBarsConfigBuilder<EnergyIntensityDatum, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit(): void {
    this.setProperties();
  }

  setProperties(): void {
    const filteredData = this.data
      .filter((x) => x.category === this.sortVar && x.value !== null)
      .slice()
      .filter((x, i) => i < 10); // artificially limits the energy dataset

    const invisibleStacks = [];
    const maxInvisible = max(filteredData, (d) => d.value);
    const minInvisible = maxInvisible / 2;

    filteredData.forEach((d) => {
      const invisibleStack = structuredClone(d);
      invisibleStack.category = 'invisible';
      // create random data
      invisibleStack.value = Math.floor(
        Math.random() * (maxInvisible - minInvisible + 1) + minInvisible
      );
      invisibleStacks.push(invisibleStack);
    });
    filteredData.push(...invisibleStacks);

    console.log('CSA dot plot data:', this.data);
    console.log('filteredData', filteredData);

    this.filteredDataConfig = this.bars
      .data(filteredData)
      .orientation('horizontal')
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.geography)
      )
      .createCategoricalDimension((dimension) =>
        dimension.valueAccessor((d) => d.category)
      )
      .createQuantitativeDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.value * 1000)
          .formatSpecifier(',.0f')
          .domainPaddingPixels(16)
      )
      .stackOrder(() => [1, 0])
      .getConfig();

    this.yAxisConfig = this.yOrdinalAxis.getConfig();
    this.xAxisConfig = this.xQuantitativeAxis
      .tickFormat(',.0f')
      .side('top')
      .numTicks(4)
      .getConfig();
  }
}
