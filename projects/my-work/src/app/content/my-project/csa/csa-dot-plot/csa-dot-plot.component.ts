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
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';
import { max } from 'd3';
import { EnergyIntensityDatum } from '../../../examples/energy-intensity/energy-intensity.component';
import { CsaStackedBarsComponent } from './csa-stacked-bars/csa-stacked-bars.component';

export interface CsaDatum extends EnergyIntensityDatum {
  plans: number[];
}

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
    CsaStackedBarsComponent,
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
  @Input() data: CsaDatum[];
  filteredDataConfig: StackedBarsConfig<CsaDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string>;
  perCap = 'Energy consumption per capita';
  sortVar = this.perCap;
  chartHeight = 600;

  constructor(
    private bars: VicStackedBarsConfigBuilder<CsaDatum, string>,
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

    // artificially create fake plan data
    const maxLength = 40;
    const dataMax = 2000000;
    filteredData
      .filter((d) => d.category !== 'invisible')
      .forEach((d) => {
        const plans = Array.from(
          { length: Math.floor(Math.random() * maxLength) },
          () => Math.floor(Math.random() * dataMax)
        );
        d.plans = plans;
      });

    console.log('original data:', this.data);
    console.log('filteredData', filteredData);

    const dotMax = max(filteredData.map((d) => max(d.plans)));
    const barMax = max(filteredData, (d) => d.value);
    const trueMax = max([dotMax, barMax]);

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
          .domain([0, trueMax])
      )
      .stackOrder(() => [1, 0])
      .getConfig();

    this.yAxisConfig = this.yOrdinalAxis.getConfig();
    this.xAxisConfig = this.xQuantitativeAxis
      .tickFormat(',.0f')
      .numTicks(4)
      .getConfig();
    console.log('this.xAxisConfig', this.xAxisConfig);
  }
}
