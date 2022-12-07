import { Component, OnInit } from '@angular/core';
import { BarsHoverEmittedOutput } from 'projects/viz-components/src/lib/bars/bars-hover-event.directive';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/html-tooltip/html-tooltip.config';
import {
  AxisConfig,
  BarsConfig,
  ElementSpacing,
  horizontalBarChartDimensionsConfig,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: BarsConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
}
@Component({
  selector: 'app-bars-example',
  templateUrl: './bars-example.component.html',
  styleUrls: ['./bars-example.component.scss'],
})
export class BarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 36,
    right: 0,
    bottom: 8,
    left: 300,
  };
  folderName = 'bars-example';
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(
      new HtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsHoverEmittedOutput> =
    new BehaviorSubject<BarsHoverEmittedOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: MetroUnemploymentDatum[]): ViewModel {
    const filteredData = data.filter(
      (d) => d.date.getFullYear() === 2008 && d.date.getMonth() === 3
    );
    const xAxisConfig = new AxisConfig();
    xAxisConfig.tickFormat = '.1f';
    const yAxisConfig = new AxisConfig();
    const dataConfig = new BarsConfig();
    dataConfig.data = filteredData;
    dataConfig.dimensions = horizontalBarChartDimensionsConfig;
    dataConfig.ordinal.valueAccessor = (d) => d.division;
    dataConfig.quantitative.valueAccessor = (d) => d.value;
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(data: BarsHoverEmittedOutput): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsHoverEmittedOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsHoverEmittedOutput): void {
    const config = new HtmlTooltipConfig();
    config.position.panelClass = 'map-tooltip'; // not used
    config.size.minWidth = 130;
    if (data) {
      config.position.offsetX = (data.bounds[1][0] + data.bounds[0][0]) / 2;
      config.position.offsetY = (data.bounds[1][1] + data.bounds[0][1] * 2) / 3;
      config.show = true;
    } else {
      config.show = false;
    }
    this.tooltipConfig.next(config);
  }
}
