import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  BarsConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicOrdinalAxisConfig,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';
import { EnergyIntensityDatum } from '../../../examples/energy-intensity/energy-intensity.component';

interface CSADatum extends EnergyIntensityDatum {
  gap: number;
}

@Component({
  selector: 'app-csa-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicXyChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
  templateUrl: './csa-dot-plot.component.html',
  styleUrl: './csa-dot-plot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsaDotPlotComponent implements OnInit {
  @Input() data: EnergyIntensityDatum[];
  sortedDataConfig: BarsConfig<CSADatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string>;
  perCap = 'Energy consumption per capita';
  sortVar = this.perCap;
  chartHeight = 600;

  constructor(
    private bars: VicBarsConfigBuilder<CSADatum, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit(): void {
    this.setProperties();
  }

  setProperties(): void {
    let sortedData = this.data
      .filter((x) => x.category === this.sortVar && x.value !== null)
      .slice()
      .sort((a, b) => {
        if (a.value > b.value) return -1;
        if (b.value > a.value) return 1;
        else return 0;
      }) as CSADatum[];

    sortedData.forEach((d) => {
      d.gap = d.value / 2;
    });
    sortedData = sortedData.filter((x, i) => i < 10); // artificially limits the energy dataset

    console.log('CSA dot plot data:', this.data);
    console.log('sortedData', sortedData);

    this.sortedDataConfig = this.bars
      .data(sortedData)
      .orientation('horizontal')
      .createQuantitativeDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.value * 1000)
          .formatSpecifier(',.0f')
          .domainPaddingPixels(16)
      )
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.geography)
      )
      .createCategoricalDimension((dimension) => dimension.range(['#2cafb0']))
      .createLabels((labels) =>
        labels
          .display(true)
          .color({ default: '#2cafb0', withinBarAlternative: 'white' })
      )
      .getConfig();

    this.yAxisConfig = this.yOrdinalAxis.getConfig();
    this.xAxisConfig = this.xQuantitativeAxis
      .tickFormat(',.0f')
      .side('top')
      .numTicks(4)
      .getConfig();
  }
}
