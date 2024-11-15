import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
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
import { max, min } from 'd3';
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
  CSA_CompVal: number;
  CSA_CompVal_Desc: string;
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
export class CsaDotPlotComponent implements OnChanges {
  @Input() data: CsaDatum[];
  rollupData: CsaDatum[] = [];
  rollupDataConfig: StackedBarsConfig<CsaDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string>;
  trueMax: number;
  chartHeight: number;

  constructor(
    private bars: VicStackedBarsConfigBuilder<CsaDatum, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnChanges(): void {
    console.log('this.data after changes', this.data);
    this.setProperties();
  }

  setProperties(): void {
    this.rollupData = [];

    this.data.forEach((plan) => {
      const visibleStack = structuredClone(plan);
      const currentRollup = this.rollupData.find((x) => x.size === plan.size);
      if (!currentRollup) {
        visibleStack.plans = [];

        const invisibleStack = structuredClone(plan);
        invisibleStack.series = 'invisible';
        invisibleStack.value = min([plan.csa_25, plan.csa_75]);

        this.rollupData.push(visibleStack);
        this.rollupData.push(invisibleStack);
      } else {
        currentRollup.plans.push(plan.planValue);
      }
    });

    if (this.rollupData.length > 0) {
      this.chartHeight = this.rollupData.length * 12;

      const dotMax = max(this.rollupData.map((d) => max(d.plans)));
      const barMax = max(this.rollupData, (d) => d.csa_75);
      this.trueMax = max([dotMax, barMax]) * 1.1;
      if (this.rollupData[0].units === 'Percentage') {
        this.trueMax = min([this.trueMax, 1]);
      }

      this.rollupData.sort((a, b) => {
        const order = ['Rural', 'Small', 'Medium', 'Large', 'Other'];
        return order.indexOf(a.size) - order.indexOf(b.size);
      });

      console.log('rollupData', this.rollupData);

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
            .domain([0, this.trueMax])
        )
        .stackOrder(() => [1, 0])
        .getConfig();

      this.yAxisConfig = this.yOrdinalAxis.getConfig();
      this.xAxisConfig = this.xQuantitativeAxis
        .tickFormat(this.getTickFormat())
        .numTicks(4)
        .getConfig();
    }
  }

  getTickFormat(): string {
    const units = this.rollupData[0].units;
    if (units === 'Percentage') {
      if (this.trueMax < 0.1) {
        return '.1%';
      } else {
        return '.0%';
      }
    } else if (this.trueMax < 10) {
      return ',.1f';
    } else {
      return ',.0f';
    }
  }
}
