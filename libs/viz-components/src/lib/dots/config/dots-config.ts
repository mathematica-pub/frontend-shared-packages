import { safeAssign } from '@mathstack/app-kit';
import { range } from 'd3';
import { DataValue } from '../../core';
import { DateChartPositionDimension } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { NumberDimension } from '../../data-dimensions/continuous-quantitative/number-dimension/number-dimension';
import { NumberVisualValueDimension } from '../../data-dimensions/continuous-quantitative/number-visual-value/number-visual-value';
import { DataDimension } from '../../data-dimensions/dimension';
import { OrdinalChartPositionDimension } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { XyPrimaryMarksConfig } from '../../marks/xy-marks/xy-primary-marks/xy-primary-marks-config';
import { Stroke } from '../../stroke/stroke';
import { DotsOptions } from './dots-options';

export class DotsConfig<
    Datum,
    XOrdinalDomain extends DataValue = string,
    YOrdinalDomain extends DataValue = string,
  >
  extends XyPrimaryMarksConfig<Datum>
  implements DotsOptions<Datum, XOrdinalDomain, YOrdinalDomain>
{
  fill:
    | OrdinalVisualValueDimension<Datum, string, string>
    | NumberVisualValueDimension<Datum, string>;
  opacity: number;
  pointerDetectionRadius: number;
  radius:
    | OrdinalVisualValueDimension<Datum, string, number>
    | NumberVisualValueDimension<Datum, number>;
  stroke: Stroke;
  x:
    | NumberChartPositionDimension<Datum>
    | DateChartPositionDimension<Datum>
    | OrdinalChartPositionDimension<Datum, XOrdinalDomain>;
  y:
    | NumberChartPositionDimension<Datum>
    | DateChartPositionDimension<Datum>
    | OrdinalChartPositionDimension<Datum, YOrdinalDomain>;

  constructor(options: DotsOptions<Datum, XOrdinalDomain, YOrdinalDomain>) {
    super();
    safeAssign(this, options);
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndices();
  }

  protected setDimensionPropertiesFromData(): void {
    this.x.setPropertiesFromData(this.data);
    this.y.setPropertiesFromData(this.data, this.y.dimensionType === 'ordinal');
    this.fill.setPropertiesFromData(this.data);
    this.radius.setPropertiesFromData(this.data);
  }

  protected setValueIndices(): void {
    this.valueIndices = range(this.data.length).filter(
      (i) => this.isValidValue('x', i) && this.isValidValue('y', i)
    );
  }

  private isValidValue(dimension: 'x' | 'y', i: number): boolean {
    const config = this[dimension];
    if (this.isContinuousQuantitativeDimension(config)) {
      return config.isValidValue(config.values[i]);
    } else {
      return true;
    }
  }

  isContinuousQuantitativeDimension(
    dimension: DataDimension<Datum, DataValue>
  ): dimension is NumberDimension<Datum> {
    return (
      dimension.dimensionType === 'number' || dimension.dimensionType === 'date'
    );
  }
}
