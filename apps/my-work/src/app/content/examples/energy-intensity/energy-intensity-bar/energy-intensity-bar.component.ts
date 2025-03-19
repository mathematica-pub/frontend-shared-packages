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
  VicOrdinalAxisConfig,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';
import { EnergyIntensityDatum } from '../energy-intensity.component';

@Component({
  selector: 'app-energy-intensity-bar',
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
  ],
  providers: [
    VicChartConfigBuilder,
    VicBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
  templateUrl: './energy-intensity-bar.component.html',
  styleUrls: [
    '../energy-intensity-charts.scss',
    './energy-intensity-bar.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EnergyIntensityBarComponent implements OnInit {
  @Input() data: EnergyIntensityDatum[];
  followingChartConfig: ChartConfig;
  followingDataConfig: BarsConfig<EnergyIntensityDatum, string>;
  sortedChartConfig: ChartConfig;
  sortedDataConfig: BarsConfig<EnergyIntensityDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string>;
  gdp = 'Energy consumption per GDP';
  perCap = 'Energy consumption per capita';
  sortVar = this.perCap;
  sortVarUnits: string;
  followVar = this.sortVar === this.perCap ? this.gdp : this.perCap;
  followVarUnits: string;
  chartHeight = 3000;

  constructor(
    private chart: VicChartConfigBuilder,
    private bars: VicBarsConfigBuilder<EnergyIntensityDatum, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit(): void {
    this.setProperties();
  }

  setProperties(): void {
    this.sortedChartConfig = this.chart
      .margin({ top: 30, right: 0, bottom: 36, left: 200 })
      .height(this.chartHeight)
      .width(600)
      .resize({ width: false, height: false })
      .getConfig();

    this.followingChartConfig = this.chart
      .margin({ top: 30, right: 36, bottom: 36, left: 24 })
      .height(this.chartHeight)
      .width(460)
      .resize({ width: false, height: false })
      .getConfig();

    const sortedData = this.data
      .filter((x) => x.category === this.sortVar && x.value !== null)
      .slice()
      .sort((a, b) => {
        if (a.value > b.value) return -1;
        if (b.value > a.value) return 1;
        else return 0;
      });

    const secondaryData = sortedData.map((gdpObj) =>
      this.data.find(
        (x) => x.category === this.followVar && x.geography === gdpObj.geography
      )
    );

    this.sortVarUnits = this.divideUnitsBy1000(sortedData[0].units);
    this.followVarUnits = this.divideUnitsBy1000(secondaryData[0].units);

    this.sortedDataConfig = this.bars
      .data(sortedData)
      .horizontal((bars) =>
        bars
          .x((dimension) =>
            dimension
              .valueAccessor((d) => d.value * 1000)
              .formatSpecifier(',.0f')
              .domainPaddingPixels(16)
          )
          .y((dimension) => dimension.valueAccessor((d) => d.geography))
      )
      .color((dimension) => dimension.range(['#2cafb0']))
      .labels((labels) =>
        labels
          .display(true)
          .color({ default: '#2cafb0', withinBarAlternative: 'white' })
      )
      .getConfig();

    this.followingDataConfig = this.bars
      .data(secondaryData)
      .horizontal((bars) =>
        bars
          .x((dimension) =>
            dimension
              .valueAccessor((d) => d.value * 1000)
              .formatSpecifier(',.0f')
              .domainPaddingPercentOver()
          )
          .y((dimension) => dimension.valueAccessor((d) => d.geography))
      )
      .color((dimension) => dimension.range(['#a560cc']))
      .labels((labels) =>
        labels
          .display(true)
          .color({ default: '#a560cc', withinBarAlternative: 'white' })
      )
      .getConfig();

    this.yAxisConfig = this.yOrdinalAxis.getConfig();
    this.xAxisConfig = this.xQuantitativeAxis
      .tickFormat(',.0f')
      .side('top')
      .numTicks(4)
      .getConfig();
  }

  divideUnitsBy1000(units: string): string {
    return units.replace('thousand', '').replace('million', 'thousand').trim();
  }
}
