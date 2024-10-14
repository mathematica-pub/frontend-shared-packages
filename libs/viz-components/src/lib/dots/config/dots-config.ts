import { range } from 'd3';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { XyPrimaryMarksConfig } from '../../marks/xy-marks/xy-primary-marks/xy-primary-marks-config';
import { Stroke } from '../../stroke/stroke';
import { DotsOptions } from './dots-options';

export class DotsConfig<Datum>
  extends XyPrimaryMarksConfig<Datum>
  implements DotsOptions<Datum>
{
  fill: string;
  pointerDetectionRadius: number;
  radius: number;
  stroke: Stroke;
  x: NumberChartPositionDimension<Datum>;
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
  }

  protected setValueIndices(): void {
    this.valueIndices = range(this.data.length).filter(
      (d) => this.x.isValidValue(d) && this.y.isValidValue(d)
    );
  }
}
