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
import { ACODatum } from '../aco-violin.component';

@Component({
  selector: 'app-aco-bar',
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
  templateUrl: './aco-violin-chart.component.html',
  styleUrls: ['./aco-violin-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AcoBarComponent implements OnInit {
  @Input() data: ACODatum[];
  sortedDataConfig: BarsConfig<ACODatum, string>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
  xAxisConfig: VicOrdinalAxisConfig<string>;
  chartHeight = 400;

  constructor(
    private bars: VicBarsConfigBuilder<ACODatum, string>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    private xOrdinalAxis: VicXOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit(): void {
    this.setProperties();
    console.log(this.data);
  }

  setProperties(): void {
    const sortedData = this.data.sort((a, b) => {
      if (a.savloss_diff > b.savloss_diff) return -1;
      if (b.savloss_diff > a.savloss_diff) return 1;
      else return 0;
    });

    // const sortedData = this.data;

    this.sortedDataConfig = this.bars
      .data(sortedData)
      .vertical((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.aco_id))
          .y((dimension) =>
            dimension
              .valueAccessor((d) => d.savloss_diff / 1000000)
              .formatSpecifier(',.2f')
              .domainPaddingPixels(10)
          )
      )
      // .color((dimension) => {
      //   console.log(dimension);
      //   return dimension.valueAccessor((d) =>
      //     d.savloss_diff > 0 ? 'red' : 'blue'
      //   );
      // })
      .color((dimension) =>
        dimension
          .valueAccessor((d) => (d.savloss_diff > 0 ? 'positive' : 'negative'))
          .range(['green', 'red'])
      )
      .getConfig();

    // this.yAxisConfig = this.yOrdinalAxis.getConfig();
    this.xAxisConfig = this.xOrdinalAxis
      .removeTickLabels()
      .removeTickMarks()
      .label((label) => label.text('ACOs').position('middle').anchor('middle'))
      .getConfig();
    this.yAxisConfig = this.yQuantitativeAxis
      .tickFormat((d) => `$${d}M`)
      .label((label) =>
        label
          .text('Savings or Losses, Millions of USD')
          .position('start')
          .anchor('start')
          .wrap((wrap) => wrap.width(100).maintainXPosition(true))
          .offset({ x: 20, y: 15 })
      )
      .side('left')
      .numTicks(10)
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
