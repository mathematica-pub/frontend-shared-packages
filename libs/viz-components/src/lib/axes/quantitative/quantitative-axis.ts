import { Directive, Input } from '@angular/core';
import { AxisTimeInterval, format, select, timeFormat } from 'd3';
import { GenericScale, Orientation } from '../../core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { ContinuousValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { VicQuantitativeAxisConfig as QuantitativeAxisConfig } from './quantitative-axis-config';

export function quantitativeAxisMixin<
  TickValue extends ContinuousValue,
  T extends AbstractConstructor<XyAxis<TickValue>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: QuantitativeAxisConfig<TickValue>;

    setTicks(tickFormat: string | ((value: TickValue) => string)): void {
      if (this.config.tickValues) {
        this.setSpecifiedTickValues(tickFormat);
      } else {
        this.setUnspecifiedTickValues(tickFormat);
      }
    }

    setSpecifiedTickValues(
      tickFormat: string | ((value: TickValue) => string)
    ): void {
      const validTickValues = this.getValidTickValues();
      this.axis.tickValues(validTickValues);
      this.axis.tickFormat((d) => {
        const formatter = d instanceof Date ? timeFormat : format;
        return typeof tickFormat === 'function'
          ? tickFormat(d)
          : formatter(tickFormat)(d);
      });
    }

    getValidTickValues(): TickValue[] {
      const domain = this.scale.domain();
      const validValues = [];
      this.config.tickValues.forEach((value) => {
        if (domain[0] <= value && value <= domain[1]) {
          validValues.push(value);
        }
      });
      return validValues;
    }

    setUnspecifiedTickValues(
      tickFormat: string | ((value: TickValue) => string)
    ): void {
      const validNumTicks = this.getValidNumTicks(tickFormat);
      this.axis.ticks(validNumTicks);
      this.axis.tickFormat((d) => {
        const formatter = d instanceof Date ? timeFormat : format;
        return typeof tickFormat === 'function'
          ? tickFormat(d)
          : formatter(tickFormat)(d);
      });
    }

    getValidNumTicks(
      tickFormat: string | ((value: TickValue) => string)
    ): number | AxisTimeInterval {
      let numValidTicks = this.getNumTicks();
      if (typeof tickFormat === 'string' && typeof numValidTicks === 'number') {
        numValidTicks = Math.round(numValidTicks);
        if (!tickFormat.includes('.')) {
          return numValidTicks;
        } else {
          return this.getValidNumTicksForStringFormatter(
            numValidTicks,
            tickFormat
          );
        }
      } else {
        return numValidTicks;
      }
    }

    getNumTicks(): number | AxisTimeInterval {
      return (
        this.config.numTicks ||
        this.config.getSuggestedNumTicksFromChartDimension({
          height: this.chart.height,
          width: this.chart.width,
        })
      );
    }

    getValidNumTicksForStringFormatter(
      numTicks: number,
      tickFormat: string
    ): number {
      let numDecimalPlaces = Number(tickFormat.split('.')[1][0]);
      if (tickFormat.includes('%')) {
        numDecimalPlaces = numDecimalPlaces + 2;
      }
      const [start, end] = this.scale.domain();
      const firstPossibleInferredTick = // The first tick that could be created AFTER the start of the domain
        start + Math.pow(10, -1 * numDecimalPlaces);
      if (firstPossibleInferredTick > end) {
        return 1;
      } else {
        let numValidTicks = 1; // tick for first value in domain
        if (numDecimalPlaces > 0) {
          numValidTicks += (end - start) * Math.pow(10, numDecimalPlaces);
        } else {
          numValidTicks += Math.floor(end - start);
        }
        if (numTicks < numValidTicks) {
          return numTicks;
        } else {
          return numValidTicks;
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getGridLineScale(): GenericScale<any, any> {
      const scale =
        this.gridLineOrientation === Orientation.horizontal
          ? this.scales.x
          : this.scales.y;
      return scale;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getGridLineLength(scale: GenericScale<any, any>): number {
      return Math.abs(scale.range()[0] - scale.range()[1]);
    }

    drawGridLines(): void {
      if (this.config.gridLines) {
        this.setGridLineOrientation();
        const gridScale = this.getGridLineScale();
        const gridLineLength = this.getGridLineLength(gridScale);
        select(this.axisRef.nativeElement).selectAll('.vic-grid-line').remove();
        select(this.axisRef.nativeElement)
          .selectAll('.tick')
          .clone(true)
          .attr('class', 'vic-grid-line')
          .style('display', (_, i) =>
            this.config.gridLines.display(i) ? null : 'none'
          )
          .select('line')
          .attr(
            this.gridLineOrientation === Orientation.horizontal ? 'x2' : 'y2',
            gridLineLength
          )
          .attr('stroke', (_, i) => this.config.gridLines.color(i))
          .attr('stroke-dasharray', this.config.gridLines.stroke.dasharray)
          .attr('stroke-width', this.config.gridLines.stroke.width)
          .attr('opacity', this.config.gridLines.stroke.opacity)
          .attr('stroke-linecap', this.config.gridLines.stroke.linecap)
          .attr('stroke-linejoin', this.config.gridLines.stroke.linejoin);
        select(this.axisRef.nativeElement)
          .selectAll('.vic-grid-line text')
          .remove();
      } else {
        select(this.axisRef.nativeElement).selectAll('.vic-grid-line').remove();
      }
    }

    postProcessAxisFeatures(): void {
      this.styleTicks();
      this.drawGridLines();
      this.removeAxisFeatures();
    }
  }

  return Mixin;
}
