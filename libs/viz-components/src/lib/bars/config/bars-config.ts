import { safeAssign } from '@mathstack/app-kit';
import { min, range } from 'd3';
import { DataValue } from '../../core/types/values';
import { FillDefinition } from '../../data-dimensions';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { OrdinalChartPositionDimension } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { XyPrimaryMarksConfig } from '../../marks/xy-marks/xy-primary-marks/xy-primary-marks-config';
import { BarsBackgrounds } from './backgrounds/bars-backgrounds';
import { BarsDimensions } from './bars-dimensions';
import { BarsOptions } from './bars-options';
import { BarsLabels } from './labels/bars-labels';

export class BarsConfig<Datum, OrdinalDomain extends DataValue>
  extends XyPrimaryMarksConfig<Datum>
  implements BarsOptions<Datum, OrdinalDomain>
{
  barsKeyFunction: (i: number) => string;
  readonly backgrounds: BarsBackgrounds;
  readonly color: OrdinalVisualValueDimension<Datum, string, string>;
  readonly customFills: FillDefinition<Datum>[];
  readonly dimensions: BarsDimensions;
  hasNegativeValues: boolean;
  readonly labels: BarsLabels<Datum>;
  readonly ordinal: OrdinalChartPositionDimension<Datum, OrdinalDomain>;
  readonly quantitative: NumberChartPositionDimension<Datum>;

  constructor(
    dimensions: BarsDimensions,
    options: BarsOptions<Datum, OrdinalDomain>
  ) {
    super();
    safeAssign(this, options);
    this.dimensions = dimensions;
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndices();
    this.setHasNegativeValues();
    this.setBarsKeyFunction();
  }

  protected setDimensionPropertiesFromData(): void {
    this.quantitative.setPropertiesFromData(this.data);
    this.ordinal.setPropertiesFromData(this.data, this.dimensions.isHorizontal);
    this.color.setPropertiesFromData(this.data);
  }

  protected setValueIndices(): void {
    this.valueIndices = range(this.data.length).filter((i) => {
      if (!this.ordinal.domainIncludes(this.ordinal.values[i])) {
        return false;
      } else {
        const ordinalValue = this.ordinal.values[i];
        const firstIndex = this.ordinal.values.indexOf(ordinalValue);
        return i === firstIndex;
      }
    });
  }

  protected setHasNegativeValues(): void {
    this.hasNegativeValues = min(this.quantitative.values) < 0;
  }

  protected setBarsKeyFunction(): void {
    this.barsKeyFunction = (i: number): string => `${this.ordinal.values[i]}`;
  }
}
