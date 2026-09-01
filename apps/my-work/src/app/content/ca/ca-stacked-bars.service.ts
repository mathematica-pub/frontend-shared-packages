/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  StackDatum,
  StackedBarsConfig,
  XyChartComponent,
  XyChartScales,
} from '@mathstack/viz';
import { scaleOrdinal, ScaleOrdinal, select, Selection } from 'd3';
import { mlbColorRange } from '../ca-access-mlb/mlb.constants';

export const barbellStackElementHeight = 3;

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
      .attr('class', 'x-label');
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
      .attr('y', this.getLabelY(chart, config));
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
      .attr(
        'x',
        this.isChartVertical(chart) && !this.isLob(config)
          ? 0
          : chart.config.width
      )
      .attr(
        'y',
        this.getLabelY(chart, config) +
          (this.isChartVertical(chart) && !this.isLob(config) ? -20 : 0)
      )
      .style(
        'text-anchor',
        this.isChartVertical(chart) && !this.isLob(config) ? 'start' : 'end'
      );
  }

  getLabelY(
    chart: XyChartComponent,
    config?: StackedBarsConfig<any, string>
  ): number {
    return this.isChartVertical(chart) && !this.isLob(config)
      ? -10
      : chart.config.height + 40;
  }

  isLob(config: StackedBarsConfig<any, string>): boolean {
    return config.data[0]?.lob;
  }

  isChartVertical(chart: XyChartComponent): boolean {
    return chart.config.width < chart.config.height;
  }

  getStackElementX(
    datum: StackDatum,
    scales: XyChartScales,
    config: StackedBarsConfig<any, string>
  ): number {
    return (
      this.getStackX(datum, scales, config) + (scales.x as any).bandwidth() / 4
    );
  }

  getStackElementY(
    datum: StackDatum,
    scales: XyChartScales,
    config: StackedBarsConfig<any, string>
  ): number {
    return (
      this.getStackY(datum, scales, config) + (scales.y as any).bandwidth() / 4
    );
  }

  getBarbellStackElementY(
    datum: StackDatum,
    scales: XyChartScales,
    config: StackedBarsConfig<any, string>
  ): number {
    return (
      this.getStackY(datum, scales, config) +
      (scales.y as any).bandwidth() / 2 -
      barbellStackElementHeight / 2
    );
  }

  getStackX(
    datum: StackDatum,
    scales: XyChartScales,
    config: StackedBarsConfig<any, string>
  ): number {
    return scales.x(config[config.dimensions.x].values[datum.i]);
  }

  getStackY(
    datum: StackDatum,
    scales: XyChartScales,
    config: StackedBarsConfig<any, string>
  ): number {
    return scales.y(config[config.dimensions.y].values[datum.i]);
  }

  getStackElementHeight(scales: XyChartScales): number {
    return (scales.y as any).bandwidth() / 2;
  }

  getStackElementWidth(scales: XyChartScales): number {
    return (scales.x as any).bandwidth() / 2;
  }

  getMlbColorScale(
    config: StackedBarsConfig<any, string>
  ): ScaleOrdinal<string, unknown, never> {
    // const domain = [
    //   ...new Set(config.data.map((d) => d.lob).filter((d) => d !== null)),
    // ];
    //.sort((a) => {
    //   return a === stateName.mock || a === stateName.real ? 1 : -1;
    // });
    // const colorRange = structuredClone(mlbColorRange);
    // if (domain.length === 2) {
    //   colorRange.splice(0, 1);
    // }
    // return scaleOrdinal().domain(domain).range(colorRange);

    const colorDomain = ['Private Market', 'Medicare Advantage', 'Medi-Cal'];
    const colorRange = structuredClone(mlbColorRange);
    return scaleOrdinal().domain(colorDomain).range(colorRange);
  }
}
