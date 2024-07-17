import { VicOrdinalAxisOptions } from '../axes/ordinal/ordinal-axis.config';
import { VicQuantitativeAxisOptions } from '../axes/quantitative/quantitative-axis.config';
import { VicXOrdinalAxisConfig } from '../axes/x-ordinal/x-ordinal-axis.config';
import { VicXQuantitativeAxisConfig } from '../axes/x-quantitative/x-quantitative-axis.config';
import { VicXAxisOptions } from '../axes/x/x-axis.config';
import { VicYOrdinalAxisConfig } from '../axes/y-ordinal/y-ordinal-axis.config';
import { VicYQuantitativeAxisConfig } from '../axes/y-quantitative-axis/y-quantitative-axis.config';
import { VicYAxisOptions } from '../axes/y/y-axis.config';
import { VicDataValue } from '../core/types/values';

export class Vic {
  static axisXOrdinal<TickValue extends VicDataValue>(
    options?: Partial<VicXAxisOptions<TickValue>> &
      Partial<VicOrdinalAxisOptions<TickValue>>
  ): VicXOrdinalAxisConfig<TickValue> {
    return new VicXOrdinalAxisConfig(options);
  }

  static axisXQuantitative<TickValue extends VicDataValue>(
    options?: Partial<VicXAxisOptions<TickValue>> &
      Partial<VicQuantitativeAxisOptions<TickValue>>
  ): VicXQuantitativeAxisConfig<TickValue> {
    return new VicXQuantitativeAxisConfig(options);
  }

  static axisYOrdinal<TickValue extends VicDataValue>(
    options?: Partial<
      VicYAxisOptions<TickValue> & Partial<VicOrdinalAxisOptions<TickValue>>
    >
  ): VicYOrdinalAxisConfig<TickValue> {
    return new VicYOrdinalAxisConfig(options);
  }

  static axisYQuantitative<TickValue extends VicDataValue>(
    options?: Partial<
      VicYAxisOptions<TickValue> &
        Partial<VicQuantitativeAxisOptions<TickValue>>
    >
  ): VicYQuantitativeAxisConfig<TickValue> {
    return new VicYQuantitativeAxisConfig(options);
  }
}
