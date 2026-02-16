/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import {
  ascending,
  axisBottom,
  axisLeft,
  descending,
  extent,
  format,
  max,
  min,
  scaleBand,
  ScaleBand,
  scaleLinear,
  ScaleLinear,
  scaleOrdinal,
  ScaleOrdinal,
  select,
  Selection,
} from 'd3';
import {
  chartWidth,
  raceCategories,
  stratLinePadding,
} from '../../../ca/ca.constants';
import { blue, darkGrey, darkOrange } from '../../../ca/color';
import { DotPlotService } from '../../../ca/dot-plot.service';
import { wrapText } from '../../../ca/wrap';
import { FinalRaceDatum } from '../final-race.component';

@Component({
  selector: 'app-final-race-arrow',
  standalone: true,
  providers: [DotPlotService],
  templateUrl:
    '../../final-county/final-county-arrow/final-county-arrow.component.html',
})
export class FinalRaceArrowComponent implements OnChanges {
  @Input() data: FinalRaceDatum[];
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;
  rollupData: FinalRaceDatum[][];
  isPercent: boolean;
  svg!: Selection<SVGSVGElement, unknown, null, undefined>;
  labelGroup!: Selection<SVGGElement, unknown, null, undefined>;
  legendGroup!: Selection<SVGGElement, unknown, null, undefined>;
  noDataGroup!: Selection<SVGGElement, unknown, null, undefined>;
  stratGroup!: Selection<SVGGElement, unknown, null, undefined>;
  xAxisGroup!: Selection<SVGGElement, unknown, null, undefined>;
  yAxisGroup!: Selection<SVGGElement, unknown, null, undefined>;
  gridGroup!: Selection<SVGGElement, unknown, null, undefined>;
  markerGroup!: Selection<SVGGElement, unknown, null, undefined>;
  lineGroup!: Selection<SVGGElement, unknown, null, undefined>;
  xScale!: ScaleLinear<number, number>;
  yScale!: ScaleBand<any>;
  colorScale!: ScaleOrdinal<string, string>;
  higherIsBetter: boolean;
  changes: string[];
  width = chartWidth;
  height: number;
  bandwidth = 44;
  extents: [string, string];
  numTicks = 5;
  strokeWidth = 3;
  arrowSize = 14;
  diamondSize = this.arrowSize / 2;
  labelWidth = 150;
  stratPadding = 3;

  constructor(private caDotPlotService: DotPlotService) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data', this.data);
      if (this.svg === undefined) {
        this.setScales();
        this.setSvg();
      }
      this.setRollupData();
      this.setExtents();
      this.setDirectionality();
      this.setIncreased();
      this.updateHeight();
      this.updateIsPercent();
      this.updateXScale();
      this.updateYScale();
      this.updateXAxis();
      this.updateYAxis();
      this.updateGrid();
      this.updateColorScale();
      this.drawLines();
      this.drawMarkers();
      this.drawLabels();
      this.drawLegend();
      this.updateStratLabels();
      this.updateNoDataLabels();
    }
  }

  setScales(): void {
    this.xScale = scaleLinear().range([0, this.width]);
    this.yScale = scaleBand();
    this.colorScale = scaleOrdinal();
  }

  setSvg(): void {
    this.svg = select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width);
    this.xAxisGroup = this.createGroup('x-axis axis');
    this.yAxisGroup = this.createGroup('y-axis axis');
    this.gridGroup = this.createGroup('grid');
    this.lineGroup = this.createGroup('lines');
    this.markerGroup = this.createGroup('markers');
    this.labelGroup = this.createGroup('labels');
    this.legendGroup = this.createGroup('legend');
    this.stratGroup = this.createGroup('strat-labels');
    this.noDataGroup = this.createGroup('no-data-labels');
  }

  createGroup(
    className: string
  ): Selection<SVGGElement, unknown, null, undefined> {
    return this.svg.append('g').attr('class', className);
  }

  setRollupData(): void {
    this.rollupData = this.data
      .filter((d) => d.value !== null)
      .map((d) =>
        this.data.filter(
          (x) => x.strat === d.strat && x.stratVal === d.stratVal
        )
      )
      .filter(
        (row, i, self) =>
          i ===
          self.findIndex(
            (o) =>
              o[0].strat === row[0].strat && o[0].stratVal === row[0].stratVal
          )
      );
    console.log('rollupData', this.rollupData);
  }

  setExtents(): void {
    this.extents = extent(this.data, (d) => +d.year).map((d) =>
      d.toString()
    ) as [string, string];

    const order = structuredClone(raceCategories);
    this.caDotPlotService.setRaceEthnicityMockCategories(order);

    this.rollupData = this.rollupData
      .filter(
        (row) =>
          row.length > 1 ||
          row.some(
            (d) => d.year !== this.extents[0] && d.year !== this.extents[1]
          )
      )
      .sort((a, b) => {
        const stratA =
          a[0].strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
        const stratB =
          b[0].strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
        return order[stratA][a[0].stratVal] - order[stratB][b[0].stratVal];
      });
  }

  setDirectionality(): void {
    this.higherIsBetter = this.data[0].directionality
      .toLowerCase()
      .includes('higher');
  }

  setIncreased(): void {
    this.rollupData.forEach((row) => {
      const firstYearValue = this.getRowValue(row, 0);
      const lastYearValue = this.getRowValue(row, 1);
      row.forEach((d) => {
        d.increased = lastYearValue > firstYearValue;
      });
    });
  }

  updateIsPercent(): void {
    this.isPercent = this.data[0].units.toLowerCase().includes('percent');
  }

  updateHeight(): void {
    this.height = this.rollupData.length * this.bandwidth;
    this.svg.attr('height', this.height);
  }

  updateXScale(): void {
    const maxWithBuffer = max(this.data, (d) => d.value) * 1.1;
    const domainMax = this.isPercent ? min([maxWithBuffer, 1]) : maxWithBuffer;
    this.xScale.domain([0, domainMax]);
  }

  updateYScale(): void {
    const domain = this.rollupData.map((d) => d[0].strat + d[0].stratVal);
    const chartRange = [0, this.height];
    this.yScale.domain(domain).range(chartRange);
  }

  updateXAxis(): void {
    this.xAxisGroup.attr('transform', `translate(0,${this.height})`).call(
      axisBottom(this.xScale)
        .tickSizeOuter(0)
        .ticks(this.numTicks)
        .tickFormat(
          format(
            this.isPercent ? '.0%' : this.xScale.domain()[1] > 10 ? ',' : '.1f'
          )
        )
    );
  }

  updateYAxis(): void {
    this.yAxisGroup
      .call(
        axisLeft(this.yScale)
          .tickSizeOuter(0)
          .tickFormat((d, i) => this.rollupData[i][0].stratVal)
      )
      .selectAll('.tick text')
      .call(wrapText, this.labelWidth, { lineHeight: 1 });
  }

  updateGrid(): void {
    this.gridGroup
      .selectAll('.y-grid')
      .data(this.yScale.domain())
      .join('line')
      .attr('class', 'gridline y-grid')
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('y1', (d) => this.yScale(d) + this.bandwidth / 2)
      .attr('y2', (d) => this.yScale(d) + this.bandwidth / 2);

    this.gridGroup
      .selectAll('.x-grid')
      .data(this.xScale.ticks(this.numTicks))
      .join('line')
      .attr('class', 'gridline x-grid')
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('x1', (d) => this.xScale(d))
      .attr('x2', (d) => this.xScale(d));
  }

  updateColorScale(): void {
    this.changes = [...new Set(this.data.map((item) => item.change))]
      .filter((d) => d !== '#N/A')
      .sort((a, b) => ascending(a, b));
    const range = [];
    if (this.changes.some((d) => d.includes('mproved'))) {
      range.push(blue);
    }
    if (this.changes.some((d) => d.includes('tayed'))) {
      range.push(darkGrey);
    }
    if (this.changes.some((d) => d.includes('orsened'))) {
      range.push(darkOrange);
    }
    this.colorScale.domain(this.changes).range(range).unknown(darkGrey);
  }

  getRowValue(row: FinalRaceDatum[], index: 0 | 1): number {
    return row.find((d) => d.year === this.extents[index])?.value;
  }

  drawLines(): void {
    this.lineGroup
      .selectAll('.line')
      .data(
        this.rollupData.filter(
          (d) =>
            this.getRowValue(d, 0) !== undefined &&
            this.getRowValue(d, 1) !== undefined
        )
      )
      .join('line')
      .attr('class', 'line')
      .attr('x1', (row) => this.xScale(this.getRowValue(row, 0)))
      .attr('x2', (row) => this.xScale(this.getRowValue(row, 1)))
      .attr('y1', (d) => this.getY(d))
      .attr('y2', (d) => this.getY(d))
      .style('stroke', (d) => this.colorScale(d[0].change))
      .style('stroke-width', this.strokeWidth);
  }

  getY(d: FinalRaceDatum[]): number {
    return this.yScale(d[0].strat + d[0].stratVal) + this.bandwidth / 2;
  }

  drawMarkers(): void {
    this.markerGroup
      .selectAll('.arrow')
      .data(
        this.rollupData
          .map((row) => row.find((d) => d.year === this.extents[1]))
          .filter((d) => d !== undefined)
      )
      .join('path')
      .attr('class', 'arrow')
      .attr('d', (d: any) => {
        const direction = d.increased ? '-' : '';
        return this.getArrowPath(direction);
      })
      .attr('transform', (d: any) => {
        const direction = d.increased ? 1 : -1;
        const x = this.xScale(d.value) + this.getArrowOffset(direction);
        const y = this.yScale(d.strat + d.stratVal) + this.bandwidth / 2;
        return `translate(${x}, ${y})`;
      })
      .style('fill', (d: FinalRaceDatum) => this.colorScale(d.change));

    this.markerGroup
      .selectAll('.diamond')
      .data(
        this.rollupData
          .map((row) =>
            row.find(
              (d) => d.year !== this.extents[0] && d.year !== this.extents[1]
            )
          )
          .filter((d) => d !== undefined)
      )
      .join('rect')
      .attr('class', 'diamond')
      .attr('width', this.diamondSize)
      .attr('height', this.diamondSize)
      .attr('transform', (d: any) => {
        const x = this.xScale(d.value) - this.diamondSize / 2;
        const y =
          this.yScale(d.strat + d.stratVal) +
          this.bandwidth / 2 -
          this.diamondSize / 2;
        return this.getDiamondTransform(x, y);
      })
      .style('fill', 'none')
      .style('stroke-width', 1.5)
      .style('stroke', (d: FinalRaceDatum) => this.colorScale(d.change));
  }

  drawLabels(): void {
    const labelOffset = 40;

    this.labelGroup
      .selectAll('.direction-label')
      .data([this.rollupData[0][0].directionality])
      .join('text')
      .attr('class', 'direction-label')
      .attr('y', this.height + labelOffset)
      .text((d) => d);

    this.labelGroup
      .selectAll('.x-label')
      .data(
        [this.rollupData[0][0].units].filter(
          (d) => !d.toLowerCase().includes('percent')
        )
      )
      .join('text')
      .attr('class', 'x-label')
      .attr('x', this.width)
      .attr('y', this.height + labelOffset)
      .attr('text-anchor', 'end')
      .text((d) => d);
  }

  drawLegend(): void {
    const data = this.changes.sort((a, b) => descending(a, b));
    const lineLength = 70;
    const legendGap = 60;

    this.legendGroup
      .attr('transform', `translate(0, ${-30})`)
      .selectAll('.line')
      .data(data)
      .join('line')
      .attr('class', 'legend-line')
      .attr('x1', lineLength + legendGap)
      .attr('x2', legendGap)
      .attr('y1', (d, i) => (i * -this.bandwidth) / 2)
      .attr('y2', (d, i) => (i * -this.bandwidth) / 2)
      .style('stroke', (d) => this.colorScale(d))
      .style('stroke-width', this.strokeWidth);

    this.legendGroup
      .selectAll('.improvement-label')
      .data(data)
      .join('text')
      .attr('class', 'improvement-label')
      .attr('x', lineLength + legendGap + 10)
      .attr('y', (d, i) => (i * -this.bandwidth) / 2)
      .attr('alignment-baseline', 'middle')
      .text((d) => d);

    this.legendGroup
      .selectAll('.arrow')
      .data(data)
      .join('path')
      .attr('class', 'arrow')
      .attr('d', (d: any) => {
        const direction = this.arrowPointsRight(d) ? '-' : '';
        return this.getArrowPath(direction);
      })
      .attr('transform', (d: any, i: number) => {
        const direction = this.arrowPointsRight(d) ? 1 : -1;
        const x =
          (this.arrowPointsRight(d) ? lineLength : 0) +
          this.getArrowOffset(direction) +
          legendGap;
        const y = (i * -this.bandwidth) / 2;
        return `translate(${x}, ${y})`;
      })
      .attr('x', (d) => (this.arrowPointsRight(d) ? 0 : lineLength + 10))
      .attr('y', (d, i) => (i * -this.bandwidth) / 2)
      .style('fill', (d) => this.colorScale(d));

    this.legendGroup
      .selectAll('.diamond')
      .data(data)
      .join('rect')
      .attr('class', 'diamond')
      .attr('width', this.diamondSize)
      .attr('height', this.diamondSize)
      .attr('transform', (d: any, i: number) => {
        const y = (i * -this.bandwidth) / 2 - this.diamondSize / 2;
        return this.getDiamondTransform(0, y);
      })
      .style('fill', 'none')
      .style('stroke-width', 1.5)
      .style('stroke', (d) => this.colorScale(d));

    let trendData = [...new Set(this.data.map((item) => item.year))].sort(
      (a, b) => {
        return this.higherIsBetter ? ascending(a, b) : descending(a, b);
      }
    );
    const smallest = trendData[0];
    const secondSmallest = trendData[1];
    trendData = [secondSmallest, smallest, ...trendData.slice(2)];

    const pointerLengthRatio = 3.2;

    this.legendGroup
      .attr('transform', `translate(0, ${-30})`)
      .selectAll('.pointer')
      .data(trendData)
      .join('line')
      .attr('class', 'pointer')
      .attr('x1', (d, i) => this.getLegendDiamondX(i, legendGap, lineLength))
      .attr('x2', (d, i) => this.getLegendDiamondX(i, legendGap, lineLength))
      .attr('y1', (2.5 * -this.bandwidth) / 2)
      .attr('y2', (pointerLengthRatio * -this.bandwidth) / 2)
      .style('stroke', 'black');

    this.legendGroup
      .selectAll('.trend-label')
      .data(trendData)
      .join('text')
      .attr('class', 'trend-label')
      .attr('x', (d, i) => this.getLegendDiamondX(i, legendGap, lineLength))
      .attr('y', ((pointerLengthRatio + 0.2) * -this.bandwidth) / 2)
      .attr('text-anchor', 'middle')
      .text((d) => d);
  }

  updateStratLabels(): void {
    let data = [...new Set(this.data.map((d) => d.strat))].sort((a) =>
      a.toLowerCase() === 'ethnicity' ? 1 : -1
    );
    data = data.length > 1 ? data : [];
    const reverseData = [...this.data].reverse();
    const strats = this.stratGroup
      .selectAll('.strat-label')
      .data(data)
      .join('g')
      .attr('class', 'strat-label');
    const offset = -this.labelWidth - 30;
    strats
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .text((d) => d)
      .attr('x', offset)
      .attr('y', (d) => this.getAverageY(d, reverseData))
      .attr('transform', (d) => {
        const y = this.getAverageY(d, reverseData);
        return `rotate(-90, ${offset}, ${y})`;
      });
    strats
      .selectAll('.strat-line')
      .data((d) => [d])
      .join('line')
      .attr('class', 'strat-line')
      .attr('x1', offset + stratLinePadding)
      .attr('x2', offset + stratLinePadding)
      .attr('y1', (d) => this.getY1(d) + this.stratPadding)
      .attr('y2', (d) => this.getY2(d, reverseData) - this.stratPadding);

    strats
      .filter((_, i) => i > 0)
      .selectAll('.strat-separator')
      .data((d) => [d])
      .join('line')
      .attr('class', 'strat-separator')
      .attr('x1', offset + stratLinePadding * 2)
      .attr('x2', -this.stratPadding * 2)
      .attr('y1', (d) => this.getY1(d))
      .attr('y2', (d) => this.getY1(d));
  }

  getY1(d: string): number {
    const strat = this.data.find((x) => x.strat === d);
    return this.yScale(strat.strat + strat.stratVal);
  }

  getY2(d: string, reverseData: FinalRaceDatum[]): number {
    const strat = reverseData.find((x) => x.strat === d);
    return (
      this.yScale(strat.strat + strat.stratVal) +
      (this.yScale as any).bandwidth()
    );
  }

  getAverageY(d: string, reverseData: FinalRaceDatum[]): number {
    const y1 = this.getY1(d);
    const y2 = this.getY2(d, reverseData);
    const average = (y1 + y2) / 2;
    return average;
  }

  updateNoDataLabels(): void {
    const data = this.rollupData.filter(
      (row) =>
        row.length === 1 &&
        row.some(
          (d) => d.year === this.extents[0] || d.year === this.extents[1]
        )
    );

    this.noDataGroup
      .selectAll('.no-data-label')
      .data(data)
      .join('text')
      .attr('class', 'no-data-label')
      .text('no data available')
      .attr('dx', '0.8em')
      .attr('y', (d) => this.getY(d));
  }

  getLegendDiamondX(i: number, legendGap: number, lineLength: number): number {
    return i === 0
      ? this.diamondSize / 2
      : i === 1
        ? legendGap
        : lineLength + legendGap;
  }

  arrowPointsRight(change: string): boolean {
    const worsened = change.toLowerCase().includes('worsened');
    return (
      (!worsened && this.higherIsBetter) || (worsened && !this.higherIsBetter)
    );
  }

  getArrowPath(direction: '-' | ''): string {
    return `M ${direction}${this.arrowSize} -${this.arrowSize / 2} L 0 0 L ${direction}${this.arrowSize} ${this.arrowSize / 2} Z`;
  }

  getArrowOffset(direction: 1 | -1): number {
    return (direction * this.arrowSize) / 5;
  }

  getDiamondTransform(x: number, y: number): string {
    return `translate(${x}, ${y})rotate(45 ${this.diamondSize / 2} ${this.diamondSize / 2})`;
  }
}
