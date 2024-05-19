import { Component, OnInit } from '@angular/core';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis.config';
import { vicXQuantitativeAxis } from 'projects/viz-components/src/lib/axes/x-quantitative/x-quantitative-axis.config';
import { vicYQuantitativeAxis } from 'projects/viz-components/src/lib/axes/y-quantitative-axis/y-quantitative-axis.config';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { vicCategoricalDimension } from 'projects/viz-components/src/lib/data-marks/dimensions/categorical-dimension';
import { vicDateDimension } from 'projects/viz-components/src/lib/data-marks/dimensions/date-dimension';
import { vicQuantitativeDimension } from 'projects/viz-components/src/lib/data-marks/dimensions/quantitative-dimension';
import {
  VicStackedAreaConfig,
  vicStackedArea,
} from 'projects/viz-components/src/lib/stacked-area/config/stacked-area.config';
import { Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicStackedAreaConfig<IndustryUnemploymentDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-area-example',
  templateUrl: './stacked-area-example.component.html',
  styleUrls: ['./stacked-area-example.component.scss'],
})
export class StackedAreaExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: VicElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-area-example';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const xAxisConfig = vicXQuantitativeAxis<Date>({
      tickFormat: '%Y',
    });
    const yAxisConfig = vicYQuantitativeAxis<number>({
      tickFormat: ',.0f',
    });
    const dataConfig = vicStackedArea<IndustryUnemploymentDatum, string>({
      data,
      x: vicDateDimension({
        valueAccessor: (d) => d.date,
      }),
      y: vicQuantitativeDimension({
        valueAccessor: (d) => d.value,
      }),
      categorical: vicCategoricalDimension({
        valueAccessor: (d) => d.industry,
      }),
    });
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
