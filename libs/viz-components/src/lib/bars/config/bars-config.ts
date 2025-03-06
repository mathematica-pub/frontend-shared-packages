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

export class BarsConfig<
    Datum,
    OrdinalDomain extends DataValue,
    ChartMultipleDomain extends DataValue = string,
  >
  extends XyPrimaryMarksConfig<Datum, ChartMultipleDomain>
  implements BarsOptions<Datum, OrdinalDomain, ChartMultipleDomain>
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
    options: BarsOptions<Datum, OrdinalDomain, ChartMultipleDomain>
  ) {
    super();
    Object.assign(this, options);
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
    this.multiples?.setPropertiesFromData(this.data);
    this.quantitative.setPropertiesFromData(this.data);
    this.ordinal.setPropertiesFromData(this.data, this.dimensions.isHorizontal);
    this.color.setPropertiesFromData(this.data);
  }

  protected setValueIndices(): void {
    if (this.multiples) {
      this.setValueIncicesWithMultiples();
    } else {
      this.setValueIndicesNoMultiples();
    }
  }

  protected setValueIndicesNoMultiples(): void {
    this.valueIndices = range(this.data.length).filter((index) => {
      if (!this.isValidOrdinalValue(index)) {
        return false;
      }
      const ordinalValue = this.ordinal.values[index];
      // Filter out duplicate ordinal values in the entire dataset
      return this.ordinal.values.indexOf(ordinalValue) === index;
    });
  }

  protected setValueIncicesWithMultiples(): void {
    const indicesByMultiple = this.getIndicesByMultiple();
    this.valueIndices = range(this.data.length).filter((index) => {
      if (
        !this.isValidMultipleValue(index) ||
        !this.isValidOrdinalValue(index)
      ) {
        return false;
      }
      const multipleValue = this.multiples.values[index];
      const ordinalValue = this.ordinal.values[index];

      if (multipleValue !== undefined) {
        const indicesInThisMultiple =
          indicesByMultiple.get(multipleValue) || [];
        const ordinalValuesInThisMultiple = indicesInThisMultiple.map(
          (i) => this.ordinal.values[i]
        );

        // Filter out duplicate ordinal values in this multiple
        return (
          ordinalValuesInThisMultiple.indexOf(ordinalValue) ===
          indicesInThisMultiple.indexOf(index)
        );
      }
      // If no valid multiple value
      return false;
    });
  }

  private isValidOrdinalValue(i: number): boolean {
    return this.ordinal.domainIncludes(this.ordinal.values[i]);
  }

  protected setHasNegativeValues(): void {
    this.hasNegativeValues = min(this.quantitative.values) < 0;
  }

  protected setBarsKeyFunction(): void {
    this.barsKeyFunction = (i: number): string => `${this.ordinal.values[i]}`;
  }
}
