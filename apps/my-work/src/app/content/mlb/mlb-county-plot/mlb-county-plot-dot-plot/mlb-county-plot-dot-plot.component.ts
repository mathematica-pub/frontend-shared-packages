import { CommonModule } from '@angular/common';
import { Component, OnChanges } from '@angular/core';
import {
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicStackedBarsConfigBuilder,
  VicStackedBarsModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { MlbDotPlotComponent } from '../../mlb-dot-plot.component';
import { lobNames } from '../../mlb.constants';
import { MlbCsaDatum } from '../mlb-county-plot.component';
import { MlbCountyPlotStackedBarsComponent } from './mlb-county-plot-stacked-bars/mlb-county-plot-stacked-bars.component';

@Component({
  selector: 'app-mlb-county-plot-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXyAxisModule,
    MlbCountyPlotStackedBarsComponent,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicChartConfigBuilder,
  ],
  templateUrl: './mlb-county-plot-dot-plot.component.html',
  styleUrl: './mlb-county-plot-dot-plot.component.scss',
})
export class MlbCountyPlotDotPlotComponent
  extends MlbDotPlotComponent
  implements OnChanges
{
  override labelWidth = 140;
  override bandwidth = 15;
  override rollupData: MlbCsaDatum[] = [];
  categories = {
    race: {
      'American Indian or Alaska Native': 0,
      Asian: 1,
      'Black or African American': 2,
      'Native Hawaiian or Other Pacific Islander': 3,
      White: 4,
      'No Race Selection and Hispanic or Latino Ethnicity': 5,
      'Some Other Race': 6,
      'Two or More Races': 7,
      'Asked But No Answer/Unknown': 8,
    },
    ethnicity: {
      'Hispanic or Latino': 9,
      'Not Hispanic or Latino': 10,
      'Asked But No Answer/Unknown': 11,
    },
  };

  override ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data after changes', this.data);
      this.setData();
      this.setProperties();
      this.setHeight();
    }
  }

  override getSortOrder(a: MlbCsaDatum, b: MlbCsaDatum): number {
    if (this.isNotStateLob(a)) {
      a = this.getStateLob(a);
    }
    if (this.isNotStateLob(b)) {
      b = this.getStateLob(b);
    }
    return b.average - a.average;
  }

  isNotStateLob(a: MlbCsaDatum): boolean {
    return a.lob !== lobNames.mock && a.lob !== lobNames.real;
  }

  getStateLob(a: MlbCsaDatum): MlbCsaDatum {
    return this.rollupData.find(
      (d) =>
        (d.lob === lobNames.mock || d.lob === lobNames.real) &&
        d.county === a.county &&
        d.series === a.series
    );
  }

  override getInvisibleStackValue(lob: MlbCsaDatum): number {
    return lob.value;
  }

  override getBarValue(lob: MlbCsaDatum): number {
    return lob.value;
  }

  override getYDimension(lob: MlbCsaDatum): string {
    return lob.county;
  }

  setHeight(): void {
    const uniqueCounties = this.rollupData.reduce((set, d) => {
      set.add(d.series + d.county);
      return set;
    }, new Set());
    this.chartConfig.height = uniqueCounties.size * this.bandwidth;
  }
}
