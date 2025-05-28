import { CommonModule } from '@angular/common';
import { Component, OnChanges } from '@angular/core';
import {
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartModule,
  VicStackedBarsConfigBuilder,
  VicStackedBarsModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { min } from 'd3';
import { MlbDotPlotComponent } from '../../mlb-dot-plot.component';
import { MlbDatum } from '../mlb-percentiles.component';
import { MlbPercentilesStackedBarsComponent } from './mlb-percentiles-stacked-bars/mlb-percentiles-stacked-bars.component';

@Component({
  selector: 'app-mlb-percentiles-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXyAxisModule,
    MlbPercentilesStackedBarsComponent,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
  templateUrl: './mlb-percentiles-dot-plot.component.html',
  styleUrl: './mlb-percentiles-dot-plot.component.scss',
})
export class MlbPercentilesDotPlotComponent
  extends MlbDotPlotComponent
  implements OnChanges
{
  categories: string[] = [];

  override ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data after changes', this.data);
      this.setData();
      this.setProperties();
    }
  }

  override getCurrentRollup(x: MlbDatum, lob: MlbDatum): boolean {
    return x.lob === lob.lob;
  }

  override getInvisibleStackValue(lob: MlbDatum): number {
    return min([lob.percentile25, lob.percentile75]) ?? null;
  }

  override getBarValue(lob: MlbDatum): number {
    return lob.percentile75;
  }

  override getSortOrder(a: MlbDatum, b: MlbDatum): number {
    return this.categories.indexOf(a.lob) - this.categories.indexOf(b.lob);
  }

  override getYDimension(lob: MlbDatum): string {
    return lob.lob;
  }
}
