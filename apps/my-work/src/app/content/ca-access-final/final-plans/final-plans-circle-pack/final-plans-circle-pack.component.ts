import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import {
  forceCollide,
  forceSimulation,
  forceX,
  forceY,
  format,
  max,
  mean,
  min,
  scaleOrdinal,
  ScaleOrdinal,
  ScalePower,
  scaleSqrt,
  select,
  Selection,
  SimulationNodeDatum,
} from 'd3';
import { chartWidth } from '../../../ca/ca.constants';
import { blue, darkOrange } from '../../../ca/color';
import { FinalPlansDatum } from '../final-plans.component';

interface MyNodeData extends SimulationNodeDatum, FinalPlansDatum {}

interface StackData {
  change: string;
  count: number;
  percent: number;
  stack: number;
  prevStack: number;
}

@Component({
  selector: 'app-final-plans-circle-pack',
  standalone: true,
  templateUrl: './final-plans-circle-pack.component.html',
})
export class FinalPlansCirclePackComponent implements OnChanges {
  @Input() data: MyNodeData[];
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;
  svg!: Selection<SVGSVGElement, unknown, null, undefined>;
  labelGroup!: Selection<SVGGElement, unknown, null, undefined>;
  legendGroup!: Selection<SVGGElement, unknown, null, undefined>;
  circleGroup!: Selection<SVGGElement, unknown, null, undefined>;
  lineGroup!: Selection<SVGGElement, unknown, null, undefined>;
  yScale!: ScaleOrdinal<string, number>;
  rScale!: ScalePower<number, number>;
  colorScale!: ScaleOrdinal<string, string>;
  strokeScale!: ScaleOrdinal<string, string>;
  width = 400;
  height = chartWidth * 0.8;
  strokeWidth = 3;
  changes: string[] = [];
  buckets: StackData[] = [];

  ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data', this.data);
      if (this.svg === undefined) {
        this.setScales();
        this.setSvg();
      }
      this.changes = this.getChanges();
      this.updateYScale();
      this.updateRScale();
      this.updateColorScale();
      this.updateStrokeScale();
      this.drawCircles();
      // this.drawLines();
      this.drawLabels();
      this.drawLegend();
    }
  }

  setScales(): void {
    this.yScale = scaleOrdinal();
    this.rScale = scaleSqrt();
    this.colorScale = scaleOrdinal();
    this.strokeScale = scaleOrdinal();
  }

  getChanges(): string[] {
    return [...new Set(this.data.map((item) => item.change))].sort((a, b) => {
      if (a.includes('mproved') && !b.includes('mproved')) {
        return -1;
      } else if (a.includes('orsened') && !b.includes('orsened')) {
        return 1;
      } else if (b.includes('mproved') && !a.includes('mproved')) {
        return 1;
      } else if (b.includes('orsened') && !a.includes('orsened')) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  updateYScale(): void {
    this.buckets = this.changes.map((change) => {
      const count = this.data.filter((d) => d.change === change).length;
      const percent = this.data.length > 0 ? count / this.data.length : 0;
      return {
        change: change,
        count: count,
        percent: percent,
        stack: 0,
        prevStack: 0,
      };
    });
    this.buckets.forEach((bucket, i) => {
      let stack = bucket.percent * this.height;
      bucket.stack = stack;
      while (i > 0) {
        stack += this.buckets[i - 1].percent * this.height;
        i--;
      }
      bucket.stack = stack;
      bucket.prevStack = stack - bucket.percent * this.height;
    });
    const range = this.buckets
      .map((bucket) => bucket.percent * this.height)
      .map((height, i, arr) => {
        let stack = height / 2;
        while (i > 0) {
          stack += arr[i - 1];
          i--;
        }
        return stack;
      });
    console.log('this.buckets', this.buckets);

    this.yScale.domain(this.changes).range(range);
  }

  updateRScale(): void {
    this.rScale
      .domain([0, max(this.data.map((d) => d.size))])
      .range([0, this.width * 0.16]);
  }

  updateColorScale(): void {
    this.colorScale.domain(this.changes).range([blue, '#f9f9f9', darkOrange]);
  }

  updateStrokeScale(): void {
    this.strokeScale
      .domain(this.changes)
      .range([this.colorScale.range()[0], 'black', this.colorScale.range()[2]]);
  }

  setSvg(): void {
    this.svg = select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.circleGroup = this.svg.append('g').attr('class', 'circles');
    this.lineGroup = this.svg.append('g').attr('class', 'lines');
    this.labelGroup = this.svg.append('g').attr('class', 'labels');
    this.legendGroup = this.svg.append('g').attr('class', 'legend');
  }

  drawLines(): void {
    this.lineGroup
      .selectAll('.line')
      .data([...this.buckets, { change: 'NA', count: 0, percent: 0, stack: 1 }])
      .join('line')
      .attr('class', 'line')
      .attr('x1', 0)
      .attr('x2', this.width)
      // .attr('y1', (d, i) => this.getY(d, i))
      .attr('y1', (d) => d.stack)
      // .attr('y2', (d, i) => this.getY(d, i))
      .attr('y2', (d) => d.stack)
      .style('stroke', 'black')
      .style('stroke-dasharray', '4 2');

    // const range = buckets
    //   .map((bucket) => bucket.percent * this.height)
    //   .map((height, i, arr) => {
    //     let stack = height / 2;
    //     while (i > 0) {
    //       stack += arr[i - 1];
    //       i--;
    //     }
    //     return stack;
    //   });
  }

  getY(d: StackData, i: number): number {
    if (d.change === 'NA') {
      return 1;
    } else {
      let stack = d.percent * this.height;
      while (i > 0) {
        stack += this.buckets[i - 1].percent * this.height;
        i--;
      }
      return stack;
    }
  }

  drawCircles(): void {
    const node = this.circleGroup
      .selectAll('.circle')
      .data(this.data)
      .join('circle')
      .attr('class', 'circle')
      .attr('r', (d) => this.rScale(d.size))
      .attr('cx', this.width / 2)
      .attr('cy', this.height / 2)
      .style('fill', (d) => this.colorScale(d.change))
      .style('stroke', (d) => this.strokeScale(d.change))
      .style('stroke-width', this.strokeWidth);

    const simulation = forceSimulation<MyNodeData>(this.data)
      .force(
        'x',
        forceX()
          .strength(0.6)
          .x(this.width / 2)
      )
      // .force(
      //   'y',
      //   forceY()
      //     .strength(0.4)
      //     .y((d) => this.yScale((d as MyNodeData).change))
      // )
      .force(
        'y',
        forceY()
          .strength(0.5)
          .y((d) =>
            mean([this.yScale((d as MyNodeData).change), this.height / 2])
          )
      )
      .force(
        'collide',
        forceCollide()
          .strength(1)
          .radius(
            (d) =>
              this.rScale((d as MyNodeData).size) + this.strokeWidth / 2 + 0.5
          )
          .iterations(9)
      );

    const gap = 2;
    simulation.nodes(this.data).on('tick', () => {
      node
        .attr('cx', (d) => {
          const minThreshold = this.rScale(d.size) + this.strokeWidth + gap;
          const maxThreshold = this.width - minThreshold;
          d.x = min([max([d.x, minThreshold]), maxThreshold]);
          return d.x;
        })
        .attr('cy', (d) => {
          const minThreshold = this.rScale(d.size) + this.strokeWidth + gap;
          const maxThreshold = this.height - minThreshold;
          d.y = min([max([d.y, minThreshold]), maxThreshold]);
          return d.y;
        });

      // if using stacks and lines
      // .attr('cy', (d) => {
      //   const bucket = this.buckets.find(
      //     (b) => b.change === (d as MyNodeData).change
      //   );
      //   const gap = 2;
      //   const minThreshold =
      //     bucket.prevStack +
      //     this.rScale((d as MyNodeData).size) +
      //     this.strokeWidth +
      //     gap;
      //   const maxThreshold =
      //     bucket.stack -
      //     this.rScale((d as MyNodeData).size) -
      //     this.strokeWidth -
      //     gap;
      //   if (d.y < minThreshold) {
      //     d.y = minThreshold;
      //   }
      //   if (d.y > maxThreshold) {
      //     d.y = maxThreshold;
      //   }
      //   return d.y;
      // });

      this.labelGroup.selectAll('.label').attr('y', (d) => {
        const meanY = [];
        node
          .filter((n) => n.change === (d as StackData).change)
          .each(function () {
            meanY.push(select(this).attr('cy'));
          });
        return mean(meanY);
      });
    });
  }

  drawLabels(): void {
    const xPosition = this.width + 10;
    const offset = '1.1em';
    const labels = this.labelGroup
      .selectAll('.label')
      .data(this.buckets)
      .join('text')
      .attr('class', 'label chart-label');
    labels
      .selectAll('.plan-count')
      .data((d) => [d])
      .join('tspan')
      .attr('class', 'plan-count')
      .attr('x', xPosition)
      .text((d) => {
        const plans = `plan${d.count > 1 ? 's' : ''}`;
        const percent = format('.0%')(d.percent);
        return `${d.count} ${plans} (${percent})`;
      })
      .attr('dy', `-${offset}`);
    labels
      .selectAll('.change')
      .data((d) => [d])
      .join('tspan')
      .attr('class', 'change')
      .attr('x', xPosition)
      .text((d) => d.change.toLowerCase())
      .attr('dy', offset);
  }

  getNearestLargeNumber(datum: number): number {
    const digits = Math.round(datum).toString().length;
    const multiple = 10 ** (digits - 1);
    return Math.round(datum / multiple) * multiple;
  }

  drawLegend(): void {
    const maxSize = max(this.data, (d) => d.size);
    const data = [maxSize, maxSize * 0.4, maxSize * 0.1].map((d) =>
      this.getNearestLargeNumber(d)
    );

    this.legendGroup
      .attr('transform', `translate(${this.width / 2}, ${-10})`)
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('class', 'circle')
      .attr('cy', (d) => -this.rScale(d) - 0)
      .attr('r', (d) => this.rScale(d))
      .style('fill', this.colorScale[1])
      .style('stroke', this.strokeScale[1])
      .style('stroke-width', this.strokeWidth);

    const lineGap = 15;
    const labelGap = 5;

    this.legendGroup
      .selectAll('.size-label')
      .data(data)
      .join('text')
      .attr('class', 'size-label')
      .attr('x', this.rScale(data[0]) + lineGap + labelGap)
      .attr('y', (d) => -this.rScale(d) * 2)
      .text((d) => `${format(',')(d)}`);

    this.legendGroup
      .selectAll('.legend-title')
      .data(['Plan Size (members)'])
      .join('text')
      .attr('class', 'legend-title')
      .attr('x', this.rScale(data[0]) + lineGap + labelGap)
      .attr('y', -this.rScale(data[0]) * 2 - 22)
      .text((d) => d);

    this.legendGroup
      .selectAll('line')
      .data(data)
      .join('line')
      .attr('x1', (d) => 10 + this.rScale(d) * 0.25)
      .attr('x2', this.rScale(data[0]) + lineGap)
      .attr('y1', (d) => -this.rScale(d) * 2)
      .attr('y2', (d) => -this.rScale(d) * 2)
      .style('stroke', 'black')
      .style('stroke-dasharray', '2 2');
  }
}
