import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DotsConfig,
  ElementSpacing,
  VicChartModule,
  VicDotsConfigBuilder,
  VicDotsModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';
import { WeatherDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { map, Observable } from 'rxjs';

interface ViewModel {
  dataConfig: DotsConfig<WeatherDatum>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-dots-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicDotsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
    VicHtmlTooltipModule,
  ],
  templateUrl: './dots-example.component.html',
  styleUrl: './dots-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VicDotsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class DotsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 36,
    right: 0,
    bottom: 8,
    left: 60,
  };

  constructor(
    private dataService: DataService,
    private dots: VicDotsConfigBuilder<WeatherDatum>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.weatherData$.pipe(
      map((data) => this.getViewModel(data))
    );
  }

  getViewModel(data: WeatherDatum[]): ViewModel {
    const xAxisConfig = this.xQuantitativeAxis.tickFormat('.1f').getConfig();
    const yAxisConfig = this.yQuantitativeAxis.tickFormat('.1f').getConfig();

    const dataConfig = this.dots
      .data(
        data.filter(
          (x) => x.location === 'Seattle' && x.date.getFullYear() === 2012
        )
      )
      .fill('red')
      .radius(2)
      .x((dimension) => dimension.valueAccessor((d) => d.tempMax))
      .y((dimension) => dimension.valueAccessor((d) => d.precipitation))
      .getConfig();

    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
