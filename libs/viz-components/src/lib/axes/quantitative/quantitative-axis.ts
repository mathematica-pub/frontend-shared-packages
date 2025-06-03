import { Directive, Input } from '@angular/core';
import { AxisTimeInterval, format, utcFormat } from 'd3';
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
        const formatter = d instanceof Date ? utcFormat : format;
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
      const validNumTicks = this.getSuggestedNumTicks(tickFormat);
      this.axis.ticks(validNumTicks);
      this.axis.tickFormat((d) => {
        const formatter = d instanceof Date ? utcFormat : format;
        return typeof tickFormat === 'function'
          ? tickFormat(d)
          : formatter(tickFormat)(d);
      });
    }

    getSuggestedNumTicks(
      tickFormat: string | ((value: Tick) => string)
    ): number | AxisTimeInterval {
      let numSuggestedTicks = this.getNumTicks();
      if (
        typeof tickFormat === 'string' &&
        typeof numSuggestedTicks === 'number'
      ) {
        numSuggestedTicks = Math.round(numSuggestedTicks);

        if (this.scale.domain()[0] instanceof Date) {
          const maxTicks = this.getMaxTicksForDateFormat(tickFormat);
          if (maxTicks !== null) {
            return Math.min(numSuggestedTicks, maxTicks);
          }
        }

        if (!tickFormat.includes('.')) {
          return numSuggestedTicks;
        } else {
          return this.getValidNumTicksForNumberFormatString(
            numSuggestedTicks,
            tickFormat
          );
        }
      } else {
        return numSuggestedTicks;
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

    getValidNumTicksForNumberFormatString(
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

    getMaxTicksForDateFormat(tickFormat: string): number | null {
      const [startDate, endDate] = this.scale.domain() as [Date, Date];

      // Year-only formatters: %Y, %y
      if (tickFormat === '%Y' || tickFormat === '%y') {
        const startYear = startDate.getUTCFullYear();
        const endYear = endDate.getUTCFullYear();
        return endYear - startYear + 1;
      }

      // Quarter formatter: %Y Q%q
      if (tickFormat === '%Y Q%q') {
        const startYear = startDate.getUTCFullYear();
        const startQuarter = Math.floor(startDate.getUTCMonth() / 3);
        const endYear = endDate.getUTCFullYear();
        const endQuarter = Math.floor(endDate.getUTCMonth() / 3);

        return (endYear - startYear) * 4 + (endQuarter - startQuarter) + 1;
      }

      // Month-year formatters: %B %Y, %b %Y
      if (tickFormat === '%B %Y' || tickFormat === '%b %Y') {
        const startYear = startDate.getUTCFullYear();
        const startMonth = startDate.getUTCMonth();
        const endYear = endDate.getUTCFullYear();
        const endMonth = endDate.getUTCMonth();

        return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
      }

      // Full date formatters: %B %d, %Y
      if (
        tickFormat === '%B %d, %Y' ||
        tickFormat === '%m/%d/%Y' ||
        tickFormat === '%Y-%m-%d'
      ) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff + 1;
      }

      // Additional common time formatters for completeness

      // Month formatters: %B (full month), %b (abbreviated), %m (numeric)
      if (tickFormat === '%B' || tickFormat === '%b' || tickFormat === '%m') {
        const startYear = startDate.getUTCFullYear();
        const startMonth = startDate.getUTCMonth();
        const endYear = endDate.getUTCFullYear();
        const endMonth = endDate.getUTCMonth();

        return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
      }

      // Day formatters: %d (day of month), %e (day of month with space), %j (day of year)
      if (tickFormat === '%d' || tickFormat === '%e' || tickFormat === '%j') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff + 1;
      }

      // Week formatters: %U, %W (week of year)
      if (tickFormat === '%U' || tickFormat === '%W') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const weeksDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
        return weeksDiff + 1;
      }

      // Hour formatters: %H (24-hour), %I (12-hour)
      if (tickFormat === '%H' || tickFormat === '%I') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));
        return hoursDiff + 1;
      }

      // Minute formatters: %M
      if (tickFormat === '%M') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
        return minutesDiff + 1;
      }

      // Second formatters: %S
      if (tickFormat === '%S') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const secondsDiff = Math.ceil(timeDiff / 1000);
        return secondsDiff + 1;
      }

      // For composite formats or unrecognized formats, return null to use default logic
      return null;
    }
  }

  return Mixin;
}
