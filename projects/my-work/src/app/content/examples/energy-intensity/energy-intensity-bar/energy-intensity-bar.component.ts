import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { VicOrdinalAxisConfig } from 'projects/viz-components/src/lib/axes/ordinal/ordinal-axis-config';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis-config';
import { BarsConfig } from 'projects/viz-components/src/lib/bars/config/bars-config';
import {
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';
import { EnergyIntensityDatum } from '../energy-intensity.component';

@Component({
  selector: 'app-energy-intensity-bar',
  standalone: true,
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
  followingDataConfig: BarsConfig<EnergyIntensityDatum, string>;
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
    private bars: VicBarsConfigBuilder<EnergyIntensityDatum, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit(): void {
    this.setProperties();
  }

  setProperties(): void {
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

    this.followingDataConfig = this.bars
      .data(secondaryData)
      .orientation('horizontal')
      .createQuantitativeDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.value * 1000)
          .formatSpecifier(',.0f')
          .domainPaddingPercentOver()
      )
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.geography)
      )
      .createCategoricalDimension((dimension) => dimension.range(['#a560cc']))
      .createLabels((labels) =>
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
