/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ChartConfig,
  ElementSpacing,
  GroupedBarsConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicGroupedBarsConfigBuilder,
  VicGroupedBarsModule,
  VicStackedBarsConfigBuilder,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { max } from 'd3';
import { map, Observable } from 'rxjs';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { CaDotPlotService } from '../../ca/ca-dot-plot.service';
import { chartWidth } from '../../ca/ca.constants';
import { mlbDataPath } from '../../ca/data-paths.constants';
import { MlbBdaDatum } from '../mlb-bda/mlb-bda.component';
import { mlbColorRange } from '../mlb.constants';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: GroupedBarsConfig<MlbBdaDatum, string>;
  yAxisConfig: VicYOrdinalAxisConfig<string>;
}

@Component({
  selector: 'app-mlb-shortage-bar',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    VicChartModule,
    VicGroupedBarsModule,
    VicXyAxisModule,
  ],
  templateUrl: 'mlb-shortage-bar.component.html',
  styleUrl: './mlb-shortage-bar.component.scss',
  providers: [
    VicChartConfigBuilder,
    CaChartService,
    CaDotPlotService,
    VicGroupedBarsConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MlbShortageBarComponent implements OnInit {
  vm$: Observable<ViewModel>;
  mlbDataPath = mlbDataPath.bda;
  filters = {
    measureCodes: [],
  };
  filterTypes = ['measureCode'];
  chartName = 'Provider Shortage';
  margin: ElementSpacing = { top: 0, right: 0, bottom: 0, left: 0 };
  width = chartWidth;
  height = 160;

  constructor(
    public caChartService: CaChartService,
    private caDotPlotService: CaDotPlotService,
    private chart: VicChartConfigBuilder,
    private groupedBars: VicGroupedBarsConfigBuilder<MlbBdaDatum, string>,
    private yAxisQuantitative: VicYOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit(): void {
    const caChartDataConfig: CaChartDataConfig = {
      filters: this.filters,
      filterTypes: this.filterTypes,
      dataPath: this.mlbDataPath,
      getTransformedData: this.getTransformedData.bind(this),
    };
    this.caChartService.init(caChartDataConfig);
    this.setVm();
  }

  getTransformedData(data: MlbBdaDatum[]): MlbBdaDatum[] {
    const transformed: MlbBdaDatum[] = data.map((x: any) => {
      const obj: MlbBdaDatum = {
        series: 'percentile',
        measureCode: x.Measure_Code,
        units: x.Units,
        directionality: x.Directionality,
        strat: x.STRAT,
        stratVal: x.StratVal_v2,
        lob: x.LOB,
        comparison: x.Comparison === 'TRUE',
        value: x.Value && !isNaN(x.Value) ? +x.Value : null,
        average: null,
      };
      return obj;
    });
    return transformed.filter((x: MlbBdaDatum) => {
      const strat = x.strat.toLowerCase();
      return strat.includes('shortage') && x.comparison === false;
    });
  }

  setVm(): void {
    this.vm$ = this.caChartService.filteredData$.pipe(
      map((data) => ({
        chartConfig: this.getChartConfig(),
        dataConfig: this.getDataConfig(data as MlbBdaDatum[]),
        yAxisConfig: this.yAxisQuantitative.getConfig(),
      }))
    );
  }

  getChartConfig(): ChartConfig {
    return this.chart
      .margin(this.margin)
      .maxHeight(this.height)
      .maxWidth(this.width)
      .scalingStrategy('fixed')
      .fixedHeight(true)
      .getConfig();
  }

  getDataConfig(data: MlbBdaDatum[]): GroupedBarsConfig<MlbBdaDatum, string> {
    const trueMax = max(data, (d) => d.value) * 1.1;
    return this.groupedBars
      .data(data.reverse())
      .horizontal((bars) =>
        bars
          .y((dimension) =>
            dimension.valueAccessor((d) => d.stratVal).paddingInner(0.3)
          )
          .x((dimension) =>
            dimension
              .valueAccessor((d) => d.value)
              .formatSpecifier(this.caDotPlotService.getTickFormat(data))
              .domain([0, trueMax])
          )
      )
      .color((dimension) =>
        dimension.valueAccessor((d) => d.lob).range(mlbColorRange)
      )
      .labels((labels) => labels.display(true))
      .getConfig();
  }
}
