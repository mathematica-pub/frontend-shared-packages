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
import { MlbCountyDatum } from '../mlb-county-plot.component';
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
  override rollupData: MlbCountyDatum[] = [];

  override ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data after changes', this.data);
      this.setData();
      this.setProperties();
      this.setHeight();
    }
  }

  override getSortOrder(a: MlbCountyDatum, b: MlbCountyDatum): number {
    let sort = a.range - b.range;
    if (a.directionality.toLowerCase().includes('higher')) {
      sort = b.range - a.range;
    }
    return sort;
  }

  override getInvisibleStackValue(lob: MlbCountyDatum): number {
    return lob.value;
  }

  override getBarValue(lob: MlbCountyDatum): number {
    return lob.value;
  }

  override getYDimension(lob: MlbCountyDatum): string {
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
