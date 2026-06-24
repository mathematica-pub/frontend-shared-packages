/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import {
  VicStackedBarsConfigBuilder,
  VicXOrdinalAxisConfigBuilder,
  VicYQuantitativeAxisConfigBuilder,
} from '@mathstack/viz';
import {
  axisBottom,
  axisLeft,
  group,
  max,
  scaleBand,
  ScaleBand,
  ScaleLinear,
  scaleLinear,
  ScaleOrdinal,
  scaleOrdinal,
  select,
  Selection,
} from 'd3';
import { chartWidth } from '../../../ca/ca.constants';
import { blue, darkOrange } from '../../../ca/color';
import { FinalMlrDatum } from '../final-mlr.component';

@Component({
  selector: 'app-final-mlr-grouped',
  standalone: true,
  providers: [
    VicStackedBarsConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
  ],
  templateUrl: './final-mlr-grouped.component.html',
})
export class FinalMLRGroupedComponent implements OnChanges {
  @Input() data: FinalMlrDatum[];
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;
  svg!: Selection<SVGSVGElement, unknown, null, undefined>;
  labelGroup!: Selection<SVGGElement, unknown, null, undefined>;
  legendGroup!: Selection<SVGGElement, unknown, null, undefined>;
  circleGroup!: Selection<SVGGElement, unknown, null, undefined>;
  barGroup!: Selection<SVGGElement, unknown, null, undefined>;
  axisGroup!: Selection<SVGGElement, unknown, null, undefined>;
  gridGroup!: Selection<SVGGElement, unknown, null, undefined>;
  fxScale!: ScaleBand<any>;
  xScale!: ScaleBand<any>;
  yScale!: ScaleLinear<number, number>;
  colorScale!: ScaleOrdinal<string, string>;
  bandwidth = 15;
  width: number;
  height = chartWidth;
  radius = 7;
  headerOffset = -175;
  averageOffset = -this.headerOffset - 76;
  circleY = this.radius - 13;

  ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data', this.data);
      this.updateWidth();
      if (this.svg === undefined) {
        this.setScales();
        this.setSvg();
      }
      this.updateFxScale();
      this.updateXScale();
      this.updateYScale();
      this.updateColorScale();
      this.drawAxes();
      this.drawGrid();
      this.drawBars();
      this.drawCircles();
      this.drawLabels();
      this.drawLegend();
    }
  }

  updateWidth(): void {
    const hasBothCompliance =
      this.data.some((d) => d.compliance) &&
      this.data.some((d) => !d.compliance);
    const multiplier = hasBothCompliance ? 2 : 4;
    this.width = this.data.length * this.bandwidth * multiplier;
    this.svg?.attr('width', this.width);
  }

  setScales(): void {
    this.fxScale = scaleBand();
    this.xScale = scaleBand();
    this.yScale = scaleLinear();
    this.colorScale = scaleOrdinal();
  }

  setSvg(): void {
    this.svg = select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.axisGroup = this.svg.append('g').attr('class', 'vic-axis-group');
    this.axisGroup.append('g').attr('class', 'x-axis');
    this.axisGroup.append('g').attr('class', 'y-axis');
    this.gridGroup = this.svg.append('g').attr('class', 'grid');
    this.barGroup = this.svg.append('g').attr('class', 'bars');
    this.circleGroup = this.svg.append('g').attr('class', 'circles');
    this.labelGroup = this.svg.append('g').attr('class', 'labels');
    this.legendGroup = this.svg
      .append('g')
      .attr('class', 'legend headers')
      .attr('transform', `translate(0, ${this.headerOffset})`);
  }

  updateFxScale(): void {
    this.fxScale
      .domain(new Set(this.data.map((d) => d.year)))
      .rangeRound([0, this.width])
      .paddingInner(0.1);
  }

  updateXScale(): void {
    this.xScale
      .domain([true, false])
      .rangeRound([0, this.fxScale.bandwidth()])
      .padding(0.05);
  }

  updateYScale(): void {
    this.yScale
      .domain([0, max(this.data, (d) => max([d.average, d.percentile75]))])
      .nice()
      .rangeRound([this.height, 0]);
  }

  updateColorScale(): void {
    this.colorScale.domain(['true', 'false']).range([blue, darkOrange]);
  }

  drawAxes(): void {
    this.axisGroup
      .select('.x-axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(axisBottom(this.fxScale).tickSizeOuter(0) as any);

    this.axisGroup.select('.y-axis').call(
      axisLeft(this.yScale)
        .ticks(null, this.data[0].units === 'Percentage' ? '%' : '')
        .tickSizeOuter(0) as any
    );
  }

  drawGrid(): void {
    this.gridGroup
      .selectAll('.x-grid')
      .data(this.yScale.ticks())
      .join('line')
      .attr('class', 'gridline x-grid')
      .attr('x2', this.width)
      .attr('y1', (d) => this.yScale(d))
      .attr('y2', (d) => this.yScale(d));

    this.gridGroup
      .selectAll('.y-grid')
      .data(this.fxScale.domain())
      .join('line')
      .attr('class', 'gridline y-grid')
      .attr('y2', this.height)
      .attr('x1', (d) => this.fxScale(d) + this.fxScale.bandwidth() / 2)
      .attr('x2', (d) => this.fxScale(d) + this.fxScale.bandwidth() / 2);
  }

  drawBars(): void {
    this.barGroup
      .selectAll('.bar-group')
      .data(group(this.data, (d) => d.year))
      .join('g')
      .attr('class', 'bar-group')
      .attr('transform', ([year]) => `translate(${this.fxScale(year)},0)`)
      .selectAll('.bar')
      .data(([, d]) => d)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => this.xScale(d.compliance))
      .attr('y', (d) => this.yScale(d.percentile75))
      .attr('width', this.xScale.bandwidth())
      .attr('height', (d) => this.yScale(0) - this.yScale(d.value))
      .attr('fill', (d) => this.colorScale(d.compliance.toString()));
  }

  drawCircles(): void {
    this.circleGroup
      .selectAll('.circle-group')
      .data(group(this.data, (d) => d.year))
      .join('g')
      .attr('class', 'circle-group')
      .attr('transform', ([year]) => `translate(${this.fxScale(year)},0)`)
      .selectAll('.average')
      .data(([, d]) => d)
      .join('circle')
      .attr('class', 'average')
      .attr(
        'cx',
        (d) => this.xScale(d.compliance) + this.xScale.bandwidth() / 2
      )
      .attr('cy', (d) => this.yScale(d.average))
      .attr('r', this.radius);
  }

  drawLabels(): void {
    this.labelGroup
      .selectAll('.direction-label')
      .data([this.data[0].directionality])
      .join('text')
      .attr('class', 'direction-label')
      .text((d) => d)
      .attr('y', -20);

    this.labelGroup
      .selectAll('.unit-label')
      .data(
        [this.data[0].units].filter(
          (d) => !d.toLowerCase().includes('percentage')
        )
      )
      .join('text')
      .attr('class', 'unit-label')
      .text((d) => d)
      .attr('y', -40);
  }

  drawLegend(): void {
    const data = [{ compliance: true }, { compliance: false }];
    const group = this.legendGroup
      .selectAll('.compliance-group')
      .data(data)
      .join('g')
      .attr('class', 'compliance-group')
      .lower();
    const rectLength = 80;
    group
      .selectAll('rect')
      .data((d) => [d])
      .join('rect')
      .attr('height', rectLength)
      .attr('width', this.xScale.bandwidth())
      .attr('transform', `translate(0, -2)`)
      .attr('x', (d) => this.xScale(d.compliance))
      .attr('fill', (d) => this.colorScale(d.compliance.toString()));
    group
      .selectAll('.average')
      .data((d) => [d])
      .join('circle')
      .attr('class', 'average')
      .attr('r', this.radius)
      .attr(
        'cx',
        (d) => this.xScale(d.compliance) + this.xScale.bandwidth() / 2
      )
      .attr('cy', rectLength / 2);
    group
      .selectAll('.compliance-label')
      .data((d) => [d])
      .join('text')
      .attr('class', 'compliance-label')
      .attr('x', (d) => this.xScale(d.compliance) + this.xScale.bandwidth() / 2)
      .attr('y', rectLength + 25)
      .text((d) => (d.compliance ? 'Compliant' : 'Non-compliant'))
      .style('text-anchor', (d) => (d.compliance ? 'end' : 'start'))
      .attr('dx', (d) => (d.compliance ? '0.5em' : '-0.5em'));
    this.legendGroup
      .selectAll('.compliance-divider')
      .data([null])
      .join('line')
      .attr('class', 'compliance-divider')
      .attr('x1', this.xScale(true) + this.xScale.bandwidth() + 1)
      .attr('x2', this.xScale(true) + this.xScale.bandwidth() + 1)
      .attr('y1', rectLength + 2)
      .attr('y2', rectLength + 27)
      .attr('stroke', '#999');
    this.legendGroup
      .selectAll('.percentile-label')
      .data(['25th Percentile', '75th Percentile'])
      .join('text')
      .attr('y', (d) => {
        const lowLabel = d === '25th Percentile';
        let y = 0;
        if (
          (this.data[0].directionality.includes('Higher') && lowLabel) ||
          (this.data[0].directionality.includes('Lower') && lowLabel)
        ) {
          y = rectLength;
        }
        return y;
      })
      .attr('x', this.xScale.bandwidth() * 2)
      .attr('dx', '0.5em')
      .attr('class', 'percentile-label')
      .text((d) => d);
    this.legendGroup
      .selectAll('.average-header-label')
      .data([this.data[0].type])
      .join('text')
      .attr('class', 'average-header-label')
      .attr('x', this.xScale.bandwidth() * 2)
      .attr('y', this.averageOffset + this.circleY)
      .attr('y', rectLength / 2)
      .attr('dx', '0.5em')
      .text((d) => d);
    this.legendGroup
      .selectAll('.legend-label')
      .data(['legend'])
      .join('text')
      .attr('class', 'legend-label')
      .attr('x', this.xScale.bandwidth() * 2)
      .attr('y', -26)
      .attr('dx', '0.5em')
      .text('legend');
  }
}
