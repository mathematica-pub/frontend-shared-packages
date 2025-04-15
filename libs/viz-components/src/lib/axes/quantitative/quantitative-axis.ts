import { Directive, Input } from '@angular/core';
import { AxisTimeInterval, format, timeFormat } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { ContinuousValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { QuantitativeTicks } from '../ticks/ticks';
import { VicQuantitativeAxisConfig as QuantitativeAxisConfig } from './quantitative-axis-config';

export function quantitativeAxisMixin<
  Tick extends ContinuousValue,
  T extends AbstractConstructor<XyAxis<Tick, QuantitativeTicks<Tick>>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: QuantitativeAxisConfig<Tick>;

    setTicks(tickFormat: string | ((value: Tick) => string)): void {
      if (this.config.ticks.values) {
        this.setSpecifiedTickValues(tickFormat);
      } else {
        this.setUnspecifiedTickValues(tickFormat);
      }
    }

    setSpecifiedTickValues(
      tickFormat: string | ((value: Tick) => string)
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

    getValidTickValues(): Tick[] {
      const domain = this.scale.domain();
      const validValues = [];
      this.config.ticks.values.forEach((value) => {
        if (domain[0] <= value && value <= domain[1]) {
          validValues.push(value);
        }
      });
      return validValues;
    }

    setUnspecifiedTickValues(
      tickFormat: string | ((value: Tick) => string)
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
      tickFormat: string | ((value: Tick) => string)
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
        this.config.ticks.count ||
        this.config.getNumTicksBySpacing(this.config.ticks.spacing, {
          height: this.chart.config.height,
          width: this.chart.config.width,
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
