import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VicStackedBarsBuilder } from 'projects/viz-components/src/lib/stacked-bars/config/stacked-bars-builder';
import {
  Vic,
  VicElementSpacing,
  VicStackedBarsConfig,
  VicXOrdinalAxisConfig,
  VicYQuantitativeAxisConfig,
} from 'projects/viz-components/src/public-api';
import { Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicStackedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: VicXOrdinalAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-bars-example',
  templateUrl: './stacked-bars-example.component.html',
  styleUrls: ['./stacked-bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [VicStackedBarsBuilder],
})
export class StackedBarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: VicElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-bars-example';

  constructor(
    private dataService: DataService,
    private stackedBars: VicStackedBarsBuilder<IndustryUnemploymentDatum, Date>
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
    const xAxisConfig = Vic.axisXOrdinal<Date>({
      tickFormat: '%Y',
    });
    const yAxisConfig = Vic.axisYQuantitative<number>({
      tickFormat: ',.0f',
    });
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
