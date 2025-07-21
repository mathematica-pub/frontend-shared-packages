/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  StackDatum,
  StackedBarsConfig,
  XyChartComponent,
  XyChartScales,
} from '@hsi/viz-components';
import { select, Selection } from 'd3';

@Injectable()
export class CaStackedBarsService {
  createCircleGroup(
    chart: XyChartComponent
  ): Selection<SVGGElement, unknown, null, undefined> {
    return select(chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans');
  }

  createDirectionLabel(
    chart: XyChartComponent
  ): Selection<SVGTextElement, unknown, null, undefined> {
    return select(chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'direction-label');
  }

  createXLabel(
    chart: XyChartComponent
  ): Selection<SVGTextElement, unknown, null, undefined> {
    return select(chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'x-label')
      .attr('x', chart.config.width);
  }

  createHeaderGroup(
    chart: XyChartComponent,
    headerOffset: number
  ): Selection<SVGGElement, unknown, null, undefined> {
    return select(chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'headers')
      .attr('transform', `translate(0, ${headerOffset})`);
  }

  updateDirectionLabel(
    directionLabel: Selection<SVGTextElement, unknown, null, undefined>,
    config: StackedBarsConfig<any, string>,
    chart: XyChartComponent
  ): void {
    directionLabel
      .text(
        config.data.find((category) => category.directionality !== null)
          .directionality
      )
      .attr('y', chart.config.height + 40);
  }

  updateXLabel(
    xLabel: Selection<SVGTextElement, unknown, null, undefined>,
    config: StackedBarsConfig<any, string>,
    chart: XyChartComponent
  ): void {
    xLabel
      .text(() => {
        const units = config.data.find(
          (category) => category.units !== null
        ).units;
        return units === 'Percentage' ? null : units;
      })
      .attr('y', chart.config.height + 40);
  }

  getStackElementY(
    datum: StackDatum,
    scales: XyChartScales,
    config: StackedBarsConfig<any, string>
  ): number {
    return (
      scales.y(config[config.dimensions.y].values[datum.i]) +
      (scales.y as any).bandwidth() / 4
    );
  }

  getStackElementHeight(scales: XyChartScales): number {
    return (scales.y as any).bandwidth() / 2;
  }
}
