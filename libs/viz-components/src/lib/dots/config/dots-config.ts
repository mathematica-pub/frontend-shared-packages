import { range } from 'd3';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { DateChartPositionDimension } from '../../data-dimensions/quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { NumberVisualValueDimension } from '../../data-dimensions/quantitative/number-visual-value/number-visual-value';
import { XyPrimaryMarksConfig } from '../../marks/xy-marks/xy-primary-marks/xy-primary-marks-config';
import { Stroke } from '../../stroke/stroke';
import { DotsOptions } from './dots-options';

export class DotsConfig<Datum>
  extends XyPrimaryMarksConfig<Datum>
  implements DotsOptions<Datum>
{
  fill:
    | OrdinalVisualValueDimension<Datum, string, string>
    | NumberVisualValueDimension<Datum, string>;
  key: (datum: Datum) => string;
  opacity: number;
  pointerDetectionRadius: number;
  radius:
    | OrdinalVisualValueDimension<Datum, string, number>
    | NumberVisualValueDimension<Datum, number>;
  stroke: Stroke;
  x: NumberChartPositionDimension<Datum> | DateChartPositionDimension<Datum>;
  y: NumberChartPositionDimension<Datum>;

  constructor(options: DotsOptions<Datum>) {
    super();
    Object.assign(this, options);
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndices();
  }

  protected setDimensionPropertiesFromData(): void {
    this.x.setPropertiesFromData(this.data);
    this.y.setPropertiesFromData(this.data);
    this.fill.setPropertiesFromData(this.data);
    this.radius.setPropertiesFromData(this.data);
  }

  protected setValueIndices(): void {
    this.valueIndices = range(this.data.length).filter(
      (i) =>
        this.x.isValidValue(this.x.values[i]) &&
        this.y.isValidValue(this.y.values[i])
    );
  }
}
