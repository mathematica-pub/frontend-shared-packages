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
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartModule,
  VicOrdinalAxisConfig,
  VicQuantitativeAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXOrdinalAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';
import { ACICountyDatum } from '../aci-county.component';

@Component({
  selector: 'app-aci-county-bar',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXOrdinalAxisModule,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
  ],
  templateUrl: './aci-county-bar.component.html',
  styleUrls: ['../aci-county-charts.scss', './aci-county-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AciCountyBarComponent implements OnInit {
  @Input() data: ACICountyDatum[];
  sortedDataConfig: BarsConfig<ACICountyDatum, string>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
  xAxisConfig: VicOrdinalAxisConfig<string>;
  chartHeight = 400;

  constructor(
    private bars: VicBarsConfigBuilder<ACICountyDatum, string>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    private xOrdinalAxis: VicXOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit(): void {
    this.setProperties();
    console.log(this.data);
  }

  setProperties(): void {
    // const sortedData = this.data.sort((a, b) => {
    //   if (a.year > b.year) return -1;
    //   if (b.year > a.year) return 1;
    //   else return 0;
    // });

    const sortedData = this.data;

    this.sortedDataConfig = this.bars
      .data(sortedData)
      .vertical((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.countyFips))
          .y((dimension) =>
            dimension
              .valueAccessor((d) => d.extremeWeatherPayments / 1000000000)
              .formatSpecifier(',.2f')
              .domainPaddingPixels(40)
          )
      )
      .color((dimension) => dimension.range(['#2cafb0']))
      .labels((labels) =>
        labels
          .display(true)
          .color({ default: '#2cafb0', withinBarAlternative: 'white' })
      )
      .getConfig();

    // this.yAxisConfig = this.yOrdinalAxis.getConfig();
    this.xAxisConfig = this.xOrdinalAxis.getConfig();
    this.yAxisConfig = this.yQuantitativeAxis
      .tickFormat(',.1f')
      .label((label) =>
        label
          .text('Billions of USD')
          .position('start')
          .anchor('start')
          .offset({ x: 15, y: 15 })
      )
      .side('left')
      .numTicks(1)
      .getConfig();

    // .label((label) =>
    //   label
    //     .position('middle')
    //     .text('Percent Unemployment (US Bureau of Labor Statistics)')
    //     .anchor('middle')
    //     .wrap((wrap) => wrap.width(700))
    //     .offset({ x: -15, y: 0 })
    // )
    // this.xAxisConfig = this.xQuantitativeAxis
    //   .tickFormat(',.0f')
    //   .side('bottom')
    //   .numTicks(4)
    //   .getConfig();
  }

  divideUnitsBy1000(units: string): string {
    return units.replace('thousand', '').replace('million', 'thousand').trim();
  }
}
