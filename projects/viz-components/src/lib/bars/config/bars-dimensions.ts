import { isNumber } from '../../core/utilities/type-guards';
import { XyChartScales } from '../../xy-chart/xy-chart.component';
import { BarDatum } from '../bars.component';

export interface VicBarsDimensions {
  x: 'ordinal' | 'quantitative';
  y: 'ordinal' | 'quantitative';
  ordinal: 'x' | 'y';
  quantitative: 'x' | 'y';
  quantitativeDimension: 'width' | 'height';
  isHorizontal: boolean;
  isVertical: boolean;
}

export const HORIZONTAL_BARS_DIMENSIONS: VicBarsDimensions = {
  x: 'quantitative',
  y: 'ordinal',
  ordinal: 'y',
  quantitative: 'x',
  quantitativeDimension: 'width',
  isHorizontal: true,
  isVertical: false,
};

export const VERTICAL_BARS_DIMENSIONS: VicBarsDimensions = {
  x: 'ordinal',
  y: 'quantitative',
  ordinal: 'x',
  quantitative: 'y',
  quantitativeDimension: 'height',
  isHorizontal: false,
  isVertical: true,
};

export class VicHorizontalBars<TOrdinalValue> implements VicBarsDimensions {
  x: 'quantitative';
  y: 'ordinal';
  ordinal: 'y';
  quantitative: 'x';
  quantitativeDimension: 'width';
  isHorizontal: boolean;
  isVertical: boolean;
  scales: XyChartScales;
  hasNegativeValues: boolean;
  domainIncludesZero: boolean;

  constructor() {
    Object.assign(this, HORIZONTAL_BARS_DIMENSIONS);
  }

  setScalesAndProperties(
    scales: XyChartScales,
    hasNegativeValues: boolean,
    domainIncludesZero: boolean
  ): void {
    this.scales = scales;
    this.hasNegativeValues = hasNegativeValues;
    this.domainIncludesZero = domainIncludesZero;
  }

  getBarX(d: BarDatum<TOrdinalValue>): number {
    if (!isNumber(d.quantitative) || d.quantitative === 0) {
      const origin = this.getBarQuantitativeOrigin();
      return this.scales.x(origin);
    } else if (this.hasNegativeValues) {
      if (d.quantitative < 0) {
        return this.scales.x(d.quantitative);
      } else {
        return this.scales.x(0);
      }
    } else {
      return this.scales.x(this.scales.x.domain()[0]);
    }
  }

  getBarY(d: BarDatum<TOrdinalValue>): number {
    return this.scales.y(d.ordinal);
  }

  getBarQuantitativeOrigin(): number {
    if (this.domainIncludesZero) {
      return 0;
    } else {
      const domain = this.scales.x.domain();
      return this.hasNegativeValues ? domain[1] : domain[0];
    }
  }

  getBarWidth(d: BarDatum<TOrdinalValue>): number {
    if (!isNumber(d.quantitative) || d.quantitative === 0) {
      return 0;
    } else {
      const origin = this.getBarQuantitativeOrigin();
      return Math.abs(this.scales.x(d.quantitative) - this.scales.x(origin));
    }
  }

  getBarHeight(d: BarDatum<TOrdinalValue>): number {
    return (this.scales.y as any).bandwidth();
  }
}

export class VicVerticalBars<TOrdinalValue> implements VicBarsDimensions {
  x: 'ordinal';
  y: 'quantitative';
  ordinal: 'x';
  quantitative: 'y';
  quantitativeDimension: 'height';
  isHorizontal: boolean;
  isVertical: boolean;
  scales: XyChartScales;
  hasNegativeValues: boolean;
  domainIncludesZero: boolean;

  constructor() {
    Object.assign(this, VERTICAL_BARS_DIMENSIONS);
  }

  setScalesAndProperties(
    scales: XyChartScales,
    hasNegativeValues: boolean,
    domainIncludesZero: boolean
  ): void {
    this.scales = scales;
    this.hasNegativeValues = hasNegativeValues;
    this.domainIncludesZero = domainIncludesZero;
  }

  getBarX(d: BarDatum<TOrdinalValue>): number {
    return this.scales.x(d.ordinal);
  }

  getBarY(d: BarDatum<TOrdinalValue>): number {
    if (!isNumber(d.quantitative) || d.quantitative === 0) {
      const origin = this.getBarQuantitativeOrigin();
      return this.scales.y(origin);
    } else if (d.quantitative < 0) {
      if (this.domainIncludesZero) {
        return this.scales.y(0);
      } else {
        return this.scales.y(this.scales.y.domain()[1]);
      }
    } else {
      return this.scales.y(d.quantitative);
    }
  }

  getBarQuantitativeOrigin(): number {
    if (this.domainIncludesZero) {
      return 0;
    } else {
      const domain = this.scales.y.domain();
      return this.hasNegativeValues ? domain[1] : domain[0];
    }
  }

  getBarWidth(d: BarDatum<TOrdinalValue>): number {
    return (this.scales.x as any).bandwidth();
  }

  getBarHeight(d: BarDatum<TOrdinalValue>): number {
    if (!isNumber(d.quantitative) || d.quantitative === 0) {
      return 0;
    }
    const origin = this.getBarQuantitativeOrigin();
    return Math.abs(this.scales.y(d.quantitative) - this.scales.y(origin));
  }
}
