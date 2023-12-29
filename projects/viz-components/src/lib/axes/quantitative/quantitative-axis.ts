import { format, timeFormat } from 'd3';
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
      const numTicks = this.config.numTicks || this.initNumTicks();
      const validatedNumTicks =
        typeof tickFormat === 'string' && typeof numTicks === 'number'
          ? this.getValidatedNumTicks(numTicks, tickFormat)
          : numTicks;
      this.axis.ticks(validatedNumTicks);
      this.axis.tickFormat((d) => {
        const formatter = d instanceof Date ? timeFormat : format;
        return typeof tickFormat === 'function'
          ? tickFormat(d)
          : formatter(tickFormat)(d);
      });
    }

    getValidatedNumTicks(numTicks: number, tickFormat: string): number {
      if (this.ticksAreIntegers(tickFormat)) {
        const [start, end] = this.scale.domain();
        if (numTicks > end - start) {
          numTicks = end - start;
        }
        if (numTicks < 1) {
          this.scale.domain([start, start + 1]);
          numTicks = 1;
        }
      }

      if (this.ticksArePercentages(tickFormat)) {
        const [start, end] = this.scale.domain();
        const numDecimalPlaces =
          this.getNumDecimalPlacesFromPercentFormat(tickFormat);
        const numPossibleTicksByPrecision =
          (end - start) * Math.pow(10, numDecimalPlaces + 2);
        if (numTicks > numPossibleTicksByPrecision) {
          numTicks = numPossibleTicksByPrecision;
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
