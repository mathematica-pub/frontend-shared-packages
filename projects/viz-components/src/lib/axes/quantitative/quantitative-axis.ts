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

    setTicks(tickFormat: string | ((value: any) => string)): void {
      if (this.config.tickValues) {
        this.setSpecifiedTickValues(tickFormat);
      } else {
        this.setUnspecifiedTickValues(tickFormat);
      }
    }

    setSpecifiedTickValues(
      tickFormat: string | ((value: any) => string)
    ): void {
      this.axis.tickValues(this.config.tickValues);
      this.axis.tickFormat((d) => {
        const formatter = d instanceof Date ? timeFormat : format;
        return typeof tickFormat === 'function'
          ? tickFormat(d)
          : formatter(tickFormat)(d);
      });
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
      let numTicks = this.getNumTicks();
      if (typeof tickFormat === 'string' && typeof numTicks === 'number') {
        numTicks = Math.round(numTicks);
        return this.getValidNumTicksStringFormatter(numTicks, tickFormat);
      } else {
        return numTicks;
      }
    }

    getNumTicks(): number | AxisTimeInterval {
      return this.config.numTicks || this.initNumTicks();
    }

    getValidNumTicksStringFormatter(
      numTicks: number,
      tickFormat: string
    ): number {
      if (this.ticksAreIntegers(tickFormat)) {
        return this.getValidIntegerNumTicks(numTicks);
      } else if (this.ticksArePercentages(tickFormat)) {
        return this.getValidPercentNumTicks(numTicks, tickFormat);
      } else {
        return numTicks;
      }
    }

    getValidIntegerNumTicks(numTicks: number): number {
      const [start, end] = this.scale.domain();
      if (numTicks > end - start) {
        numTicks = end - start;
      }
      if (numTicks < 1) {
        this.scale.domain([start, start + 1]);
        numTicks = 1;
      }
      return numTicks;
    }

    getValidPercentNumTicks(numTicks: number, tickFormat: string): number {
      const [start, end] = this.scale.domain();
      const numDecimalPlaces =
        this.getNumDecimalPlacesFromPercentFormat(tickFormat);
      const numPossibleTicks =
        (end - start) * Math.pow(10, numDecimalPlaces + 2);
      if (numTicks > numPossibleTicks) {
        numTicks = numPossibleTicks;
      }
      if (numTicks < 1) {
        if (numTicks === 0) {
          this.scale.domain([
            start,
            start + Math.pow(10, -1 * (numDecimalPlaces + 2)),
          ]);
        } else {
          this.scale.domain([
            start,
            this.ceilToPrecision(end, numDecimalPlaces + 2),
          ]);
        }
        numTicks = 1;
      }
      return numTicks;
    }

    ticksAreIntegers(tickFormat: string): boolean {
      return tickFormat.includes('0f');
    }

    ticksArePercentages(tickFormat: string): boolean {
      return /\d+%/.test(tickFormat);
    }

    getNumDecimalPlacesFromPercentFormat(formatString: string): number {
      const decimalFormatString = formatString.replace(/[^0-9.]/g, '');
      if (decimalFormatString === '' || decimalFormatString === '.') {
        return 0;
      }
      return parseInt(decimalFormatString.split('.')[1] || '0');
    }

    ceilToPrecision(value: number, precision: number): number {
      return (
        Math.ceil(value * Math.pow(10, precision)) / Math.pow(10, precision)
      );
    }
  }

  return Mixin;
}
