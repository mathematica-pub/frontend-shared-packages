import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { XOrdinalAxisConfig } from 'projects/viz-components/src/lib/axes/x-ordinal/x-ordinal-axis-config';
import { YQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/y-quantitative-axis/y-quantitative-axis-config';
import { ElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { VicStackedBarsBuilder } from 'projects/viz-components/src/lib/stacked-bars/config/stacked-bars-builder';
import { StackedBarsConfig } from 'projects/viz-components/src/lib/stacked-bars/config/stacked-bars-config';
import {
  VicChartModule,
  VicStackedBarsModule,
  VicXOrdinalAxisBuilder,
  VicXOrdinalAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisBuilder,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../../core/models/data';
import { DataService } from '../../core/services/data.service';
import { ExampleDisplayComponent } from '../../example-display/example-display.component';

interface ViewModel {
  dataConfig: StackedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: XOrdinalAxisConfig<Date>;
  yAxisConfig: YQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-bars-example',
  standalone: true,
  imports: [
    CommonModule,
    ExampleDisplayComponent,
    VicChartModule,
    VicStackedBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXOrdinalAxisModule,
  ],
  templateUrl: './stacked-bars-example.component.html',
  styleUrls: ['./stacked-bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    VicStackedBarsBuilder,
    VicXOrdinalAxisBuilder,
    VicYQuantitativeAxisBuilder,
  ],
})
export class StackedBarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-bars-example';

  constructor(
    private dataService: DataService,
    private stackedBars: VicStackedBarsBuilder<IndustryUnemploymentDatum, Date>,
    private xAxisOrdinal: VicXOrdinalAxisBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisBuilder<number>
  ) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const yearlyData = data.filter(
      (d) => d.date.getUTCDate() === 1 && d.date.getUTCMonth() === 0
    );
    const xAxisConfig = this.xAxisOrdinal.tickFormat('%Y').build();
    const yAxisConfig = this.yAxisQuantitative.tickFormat(',.0f').build();
    const dataConfig = this.stackedBars
      .data(yearlyData)
      .orientation('vertical')
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.date)
      )
      .createQuantitativeDimension((dimension) =>
        dimension.valueAccessor((d) => d.value)
      )
      .createCategoricalDimension((dimension) =>
        dimension.valueAccessor((d) => d.industry)
      )
      .build();

    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
