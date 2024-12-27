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
import { TotalExpendituresDatum } from '../total-expenditures.component';

@Component({
  selector: 'app-expend-bar',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXOrdinalAxisModule,
    VicYQuantitativeAxisModule,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
  ],
  templateUrl: './total-expenditures-bar.component.html',
  styleUrls: [
    '../total-expenditures-charts.scss',
    './total-expenditures-bar.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TotalExpendituresBarComponent implements OnInit {
  @Input() data: TotalExpendituresDatum[];
  sortedDataConfig: BarsConfig<TotalExpendituresDatum, string>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
  xAxisConfig: VicOrdinalAxisConfig<string>;
  chartHeight = 400;

  constructor(
    private bars: VicBarsConfigBuilder<TotalExpendituresDatum, string>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    private xOrdinalAxis: VicXOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit(): void {
    this.setProperties();
    console.log(this.data);
  }

  setProperties(): void {
    const sortedData = this.data.sort((a, b) => {
      if (a.year > b.year) return -1;
      if (b.year > a.year) return 1;
      else return 0;
    });

    // this.sortVarUnits = this.divideUnitsBy1000(sortedData[0].units);

    this.sortedDataConfig = this.bars
      .data(sortedData)
      .vertical((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.type))
          .y((dimension) =>
            dimension
              .valueAccessor((d) => d.extreme_weather_payments / 1000000000)
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
    this.xAxisConfig = this.xOrdinalAxis
      // .label((label) =>
      //   label
      //     .text('Year Label')
      //     .position('middle')
      //     .anchor('middle')
      //     .offset({ x: 0, y: 5 })
      // )
      .getConfig();
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
      .numTicks(5)
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
