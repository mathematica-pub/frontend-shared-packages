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
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';
import { MetroUnemploymentDatum } from '../../../../core/models/data';

@Component({
  selector: 'app-quick-start-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
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
  templateUrl: './quick-start-example.component.html',
  styleUrl: './quick-start-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class QuickStartExampleComponent implements OnInit {
  @Input() data: MetroUnemploymentDatum[];
  barsConfig: BarsConfig<MetroUnemploymentDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string>;

  constructor(
    private bars: VicBarsConfigBuilder<MetroUnemploymentDatum, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit() {
    this.barsConfig = this.bars
      .data(this.data)
      .orientation('horizontal')
      .createQuantitativeDimension((dimension) =>
        dimension.valueAccessor((d) => d.value)
      )
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.division)
      )
      .createCategoricalDimension((dimension) => dimension.range(['teal']))
      .createLabels()
      .getConfig();

    this.xAxisConfig = this.xQuantitativeAxis.getConfig();
    this.yAxisConfig = this.yOrdinalAxis
      .createTickWrap((wrap) =>
        wrap.wrapWidth(140).maintainYPosition(true).maintainXPosition(true)
      )
      .getConfig();
  }
}
