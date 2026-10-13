import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  BarsConfig,
  BarsHost,
  BarsHoverMoveEmitTooltipData,
  BarsInteractionOutput,
  ChartConfig,
  ElementSpacing,
  HoverMoveAction,
  HtmlTooltipConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicXOrdinalAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@mathstack/viz';
import { MetroUnemploymentDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { format } from 'd3';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: BarsConfig<MetroUnemploymentDatum, string>;
  xAxisConfig:
    VicXOrdinalAxisConfig<string> | VicXQuantitativeAxisConfig<number>;
  yAxisConfig:
    VicYOrdinalAxisConfig<string> | VicYQuantitativeAxisConfig<number>;
}

enum Orientation {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

interface LayoutProperties {
  orientation: Orientation;
  margin: ElementSpacing;
}

type PerformanceScenario = 'warm-update' | 'changed-text' | 'scale-only';

interface PerformanceState {
  labelChangeOffset: number;
  geometryOffset: number;
  scaleVariant: 'default' | 'compact';
  sequence: number;
}

@Component({
  selector: 'app-bars-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  providers: [
    VicChartConfigBuilder,
    VicBarsConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
  templateUrl: './bars-example.component.html',
  styleUrls: ['./bars-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class BarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  folderName = 'bars-example';
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  interactionOutput: BehaviorSubject<
    BarsInteractionOutput<MetroUnemploymentDatum>
  > = new BehaviorSubject<BarsInteractionOutput<MetroUnemploymentDatum>>(null);
  interactionOutput$ = this.interactionOutput.asObservable();
  hoverMoveActions: HoverMoveAction<
    BarsHost<MetroUnemploymentDatum, string>,
    BarsInteractionOutput<MetroUnemploymentDatum>
  >[] = [new BarsHoverMoveEmitTooltipData()];
  layoutProperties: BehaviorSubject<LayoutProperties> =
    new BehaviorSubject<LayoutProperties>({
      orientation: Orientation.horizontal,
      margin: {
        top: 36,
        right: 0,
        bottom: 32,
        left: 300,
      },
    });
  layoutProperties$ = this.layoutProperties.asObservable();
  performanceState = new BehaviorSubject<PerformanceState>({
    labelChangeOffset: 0,
    geometryOffset: 0,
    scaleVariant: 'default',
    sequence: 0,
  });
  performanceState$ = this.performanceState.asObservable();
  performanceStatus = new BehaviorSubject(
    'Ready to run a labeled bar chart update.'
  );
  performanceStatus$ = this.performanceStatus.asObservable();
  private initialMeasurementScheduled = false;
  private performanceRun = 0;
  private quantitativeValueFormatter = (
    datum: MetroUnemploymentDatum
  ): string => this.getQuantitativeValueFormat(datum);
  private dataService = inject(DataService);
  private bars = inject(VicBarsConfigBuilder<MetroUnemploymentDatum, string>);
  private chart = inject(VicChartConfigBuilder);
  private xOrdinalAxis = inject(VicXOrdinalAxisConfigBuilder<string>);
  private xQuantitativeAxis = inject(VicXQuantitativeAxisConfigBuilder<number>);
  private yOrdinalAxis = inject(VicYOrdinalAxisConfigBuilder<string>);
  private yQuantitativeAxis = inject(VicYQuantitativeAxisConfigBuilder<number>);
  private tooltip = inject(VicHtmlTooltipConfigBuilder);

  ngOnInit(): void {
    performance.mark('bars-label-initial-render-start');
    const data$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x)
    );

    this.vm$ = combineLatest([
      data$,
      this.layoutProperties$,
      this.performanceState$,
    ]).pipe(
      map(([data, layoutProperties, performanceState]) => {
        if (!this.initialMeasurementScheduled) {
          this.initialMeasurementScheduled = true;
          this.completePerformanceMeasure(
            'initial-render',
            'bars-label-initial-render-start'
          );
        }
        return this.getViewModel(data, layoutProperties, performanceState);
      })
    );
  }

  getViewModel(
    data: MetroUnemploymentDatum[],
    layout: LayoutProperties,
    performanceState: PerformanceState
  ): ViewModel {
    const filteredData = this.getPerformanceData(data, performanceState);

    const chartConfig = this.chart
      .margin(layout.margin)
      .maxWidth(
        performanceState.scaleVariant === 'compact'
          ? 640
          : layout.orientation === 'horizontal'
            ? 800
            : 960
      )
      .maxHeight(layout.orientation === 'horizontal' ? 800 : 500)
      .scalingStrategy('responsive-width')
      .getConfig();

    const xAxisConfig =
      layout.orientation === Orientation.horizontal
        ? this.xQuantitativeAxis
            .side('top')
            .ticks((ticks) => ticks.format('.0f'))
            .getConfig()
        : this.xOrdinalAxis
            .ticks((ticks) => ticks.marksDisplay(false).rotate(30))
            .getConfig();
    const yAxisConfig =
      layout.orientation === Orientation.horizontal
        ? this.yOrdinalAxis
            .ticks((ticks) => ticks.marksDisplay(false))
            .getConfig()
        : this.yQuantitativeAxis
            .ticks((ticks) => ticks.format('.0f'))
            .getConfig();

    const dataConfig = this.bars
      .data(filteredData)
      .horizontal(
        layout.orientation === Orientation.horizontal
          ? (bars) =>
              bars
                .x((dimension) =>
                  dimension
                    .valueAccessor((d) => d.value)
                    .formatFunction(this.quantitativeValueFormatter)
                    .domainPaddingPixels()
                )
                .y((dimension) => dimension.valueAccessor((d) => d.division))
          : null
      )
      .vertical(
        layout.orientation === Orientation.vertical
          ? (bars) =>
              bars
                .x((dimension) => dimension.valueAccessor((d) => d.division))
                .y((dimension) =>
                  dimension
                    .valueAccessor((d) => d.value)
                    .formatFunction(this.quantitativeValueFormatter)
                    .domainPaddingPixels()
                )
          : null
      )
      .color((dimension) => dimension.range(['royalblue']))
      .backgrounds((backgrounds) => backgrounds.color('papayawhip'))
      .labels((labels) => labels.display(true))
      .getConfig();

    return {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  getQuantitativeValueFormat(d: MetroUnemploymentDatum): string {
    const label =
      d.value === undefined || d.value === null
        ? 'N/A'
        : format('.1f')(d.value);
    return d.value > 8 ? `${label}*` : label;
  }

  updateTooltipForNewOutput(
    output: BarsInteractionOutput<MetroUnemploymentDatum> | null
  ): void {
    this.interactionOutput.next(output);
    this.updateTooltipConfig(output);
  }

  updateTooltipConfig(
    output: BarsInteractionOutput<MetroUnemploymentDatum> | null
  ): void {
    const config = this.tooltip
      .positionFromOutput(output)
      .show(!!output)
      .getConfig();
    this.tooltipConfig.next(config);
  }

  updateOrientation(value: Orientation): void {
    this.layoutProperties.next({
      orientation: value,
      margin: {
        top: 36,
        right: 0,
        bottom: value === Orientation.horizontal ? 32 : 200,
        left: value === Orientation.horizontal ? 300 : 160,
      },
    });
  }

  runPerformanceScenario(scenario: PerformanceScenario): void {
    const current = this.performanceState.value;
    const nextSequence = current.sequence + 1;
    const markPrefix = `bars-label-${scenario}-${++this.performanceRun}`;
    performance.mark(`${markPrefix}-start`);

    this.performanceState.next({
      labelChangeOffset:
        scenario === 'changed-text'
          ? current.labelChangeOffset === 0
            ? 0.2
            : 0
          : current.labelChangeOffset,
      geometryOffset:
        scenario === 'warm-update'
          ? current.geometryOffset <= 0
            ? 0.01
            : -0.01
          : current.geometryOffset,
      scaleVariant:
        scenario === 'scale-only'
          ? current.scaleVariant === 'default'
            ? 'compact'
            : 'default'
          : current.scaleVariant,
      sequence: nextSequence,
    });
    this.performanceStatus.next(`Running ${scenario.replace('-', ' ')}.`);
    this.completePerformanceMeasure(
      scenario,
      `${markPrefix}-start`,
      markPrefix
    );
  }

  private getPerformanceData(
    data: MetroUnemploymentDatum[],
    state: PerformanceState
  ): MetroUnemploymentDatum[] {
    const snapshot = data.filter(
      (datum) =>
        datum.date.getFullYear() === 2008 && datum.date.getMonth() === 3
    );

    return snapshot.map((datum, index) => {
      const labelOffset = index === 0 ? state.labelChangeOffset : 0;
      const valueBeforeGeometryUpdate = datum.value + labelOffset;
      const proposedValue = valueBeforeGeometryUpdate + state.geometryOffset;
      const preservesRenderedText =
        this.getQuantitativeValueFormat({ ...datum, value: proposedValue }) ===
        this.getQuantitativeValueFormat({
          ...datum,
          value: valueBeforeGeometryUpdate,
        });
      const geometryOffset = preservesRenderedText
        ? state.geometryOffset
        : -state.geometryOffset;
      return {
        ...datum,
        value: valueBeforeGeometryUpdate + geometryOffset,
      };
    });
  }

  private completePerformanceMeasure(
    scenario: string,
    startMark: string,
    markPrefix = 'bars-label-initial-render'
  ): void {
    window.setTimeout(() => {
      const endMark = `${markPrefix}-end`;
      performance.mark(endMark);
      performance.measure(`bars-label-${scenario}`, startMark, endMark);
      this.performanceStatus.next(
        `${scenario.replace('-', ' ')} complete. Performance mark recorded.`
      );
    }, 300);
  }
}
