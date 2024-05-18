import { Directive, Input } from '@angular/core';
import { AxisTimeInterval, format, timeFormat } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxis } from '../xy-axis';
import { VicQuantitativeAxisConfig } from './quantitative-axis.config';

/**
 * A mixin that extends `XyAxis` with the functionality needed for a quantitative axis.
 *
 * For internal library use only.
 */
export function mixinQuantitativeAxis<
  TickValue extends number | Date,
  T extends AbstractConstructor<XyAxis<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: VicQuantitativeAxisConfig<TickValue>;

    setAxis(axisFunction: any): void {
      this.axis = axisFunction(this.scale);
      this.setTicks(this.config.tickFormat);
    }

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
  }

  return Mixin;
}
