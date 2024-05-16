import { AxisTimeInterval, format, timeFormat } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxis } from '../xy-axis';

/**
 * A mixin that extends `XyAxis` with the functionality needed for a quantitative axis.
 *
 * For internal library use only.
 */
export function mixinQuantitativeAxis<T extends AbstractConstructor<XyAxis>>(
  Base: T
) {
  abstract class Mixin extends Base {
    defaultTickFormat = ',.1f';

    setAxis(axisFunction: any): void {
      const tickFormat = this.config.tickFormat || this.defaultTickFormat;
      this.axis = axisFunction(this.scale);
      this.setTicks(tickFormat);
    }

    setTicks(tickFormat: string | ((value: number | Date) => string)): void {
      if (this.config.tickValues) {
        this.setSpecifiedTickValues(tickFormat);
      } else {
        this.setUnspecifiedTickValues(tickFormat);
      }
    }

    setSpecifiedTickValues(
      tickFormat: string | ((value: any) => string)
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

    getValidTickValues(): number[] | Date[] {
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
      tickFormat: string | ((value: any) => string)
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
      tickFormat: string | ((value: any) => string)
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
      return this.config.numTicks || this.initNumTicks();
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
