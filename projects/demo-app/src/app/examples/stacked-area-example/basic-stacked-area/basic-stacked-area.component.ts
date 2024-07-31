import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  HoverMoveEventEffect,
  StackedAreaHoverMoveDirective,
  StackedAreaHoverMoveEmitTooltipData,
  VicAxisConfig,
  VicChartModule,
  VicElementSpacing,
  VicHtmlTooltipConfig,
  VicHtmlTooltipModule,
  VicHtmlTooltipOffsetFromOriginPosition,
  VicStackedAreaConfig,
  VicStackedAreaEventOutput,
  VicStackedAreaModule,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { IndustryUnemploymentDatum } from '../../../core/models/data';
import { DataService } from '../../../core/services/data.service';

interface ViewModel {
  dataConfig: VicStackedAreaConfig<IndustryUnemploymentDatum>;
  xAxisConfig: VicAxisConfig;
  yAxisConfig: VicAxisConfig;
}

class StackedAreaExampleTooltipConfig extends VicHtmlTooltipConfig {
  constructor(config: Partial<VicHtmlTooltipConfig> = {}) {
    super();
    this.size.minWidth = 130;
    Object.assign(this, config);
  }
}

@Component({
  selector: 'app-basic-stacked-area',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicXyChartModule,
    VicStackedAreaModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
    VicHtmlTooltipModule,
  ],
  templateUrl: './basic-stacked-area.component.html',
  styleUrl: './basic-stacked-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BasicStackedAreaComponent {
  vm$: Observable<ViewModel>;
  margin: VicElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-area-example';
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig(new StackedAreaExampleTooltipConfig())
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<
    VicStackedAreaEventOutput<IndustryUnemploymentDatum>
  > = new BehaviorSubject<VicStackedAreaEventOutput<IndustryUnemploymentDatum>>(
    null
  );
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveEffects: HoverMoveEventEffect<
    StackedAreaHoverMoveDirective<IndustryUnemploymentDatum>
  >[] = [new StackedAreaHoverMoveEmitTooltipData()];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const xAxisConfig = new VicAxisConfig();
    xAxisConfig.tickFormat = '%Y';
    const yAxisConfig = new VicAxisConfig();
    yAxisConfig.tickFormat = ',.0f';
    const dataConfig = new VicStackedAreaConfig<IndustryUnemploymentDatum>();
    dataConfig.data = data;
    dataConfig.x.valueAccessor = (d) => d.date;
    dataConfig.y.valueAccessor = (d) => d.value;
    dataConfig.category.valueAccessor = (d) => d.industry;
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(
    data: VicStackedAreaEventOutput<IndustryUnemploymentDatum>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(
    output: VicStackedAreaEventOutput<IndustryUnemploymentDatum>
  ): void {
    this.tooltipData.next(output);
  }

  updateTooltipConfig(
    output: VicStackedAreaEventOutput<IndustryUnemploymentDatum>
  ): void {
    const config = new StackedAreaExampleTooltipConfig();
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
    if (output && output.hoveredDatum !== undefined) {
      config.position.offsetX = output.positionX;
      config.position.offsetY = output.categoryYMin - 5;
      config.show = true;
    } else {
      config.show = false;
      config.origin = undefined;
    }
    this.tooltipConfig.next(config);
  }
}
