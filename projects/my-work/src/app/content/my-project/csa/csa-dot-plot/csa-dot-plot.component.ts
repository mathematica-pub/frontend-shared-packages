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
import { CsaStackedBarsComponent } from './csa-stacked-bars/csa-stacked-bars.component';

export interface CsaDatum {
  series: string;
  size: string;
  plans: number[];
  csa_25: number;
  csa_75: number;
  measureCode: string;
  stratVal: string;
  delivSys: string;
  value: number;
  planValue: number;
  units: string;
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
  rollupData: CsaDatum[] = [];
  rollupDataConfig: StackedBarsConfig<CsaDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string>;
  percentile = 'percentile';
  sortVar = this.percentile;
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
      .filter((x) => x.series === this.sortVar && x.value !== null)
      // TODO: select these via dropdown. Perhaps in csa.component?
      .filter(
        (x) =>
          x.measureCode === 'AOGX' &&
          x.stratVal === 'Child' &&
          x.delivSys === 'PZIL'
      )
      .slice();

    filteredData.forEach((plan) => {
      const visibleStack = structuredClone(plan);
      const currentRollup = this.rollupData.find((x) => x.size === plan.size);
      if (!currentRollup) {
        visibleStack.plans = [];

        const invisibleStack = structuredClone(plan);
        invisibleStack.series = 'invisible';
        invisibleStack.value = plan.csa_25;

        this.rollupData.push(visibleStack);
        this.rollupData.push(invisibleStack);
      } else {
        currentRollup.plans.push(plan.planValue);
      }
    });

    const dotMax = max(this.rollupData.map((d) => max(d.plans)));
    const barMax = max(this.rollupData, (d) => d.csa_75);
    const trueMax = max([dotMax, barMax]) * 1.1;

    console.log('original data:', this.data);
    console.log('filteredData', filteredData);
    console.log('rollupData', this.rollupData);
    console.log('trueMax', trueMax);

    this.rollupDataConfig = this.bars
      .data(this.rollupData)
      .orientation('horizontal')
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.size)
      )
      .createCategoricalDimension((dimension) =>
        dimension.valueAccessor((d) => d.series)
      )
      .createQuantitativeDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.value)
          .formatSpecifier(',.0f')
          .domainPaddingPixels(16)
          .domain([0, trueMax])
      )
      .stackOrder(() => [1, 0])
      .getConfig();

    this.yAxisConfig = this.yOrdinalAxis.getConfig();
    this.xAxisConfig = this.xQuantitativeAxis
      .tickFormat(this.getTickFormat())
      .numTicks(4)
      .getConfig();
  }

  getTickFormat(): string {
    const units = this.rollupData[0].units;
    if (units === 'Percentage') {
      return '.0%';
    } else {
      return ',.0f';
    }
  }
}
