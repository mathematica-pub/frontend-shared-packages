import { VicDataValue } from '../../core/types/values';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis.config';
import { VicXyAxisConfig } from '../xy-axis.config';
import { VicYAxisOptions, mixinYAxisConfig } from '../y/y-axis.config';

const AbstractYOrdinalConfig = mixinYAxisConfig(
  mixinOrdinalAxisConfig(VicXyAxisConfig)
);

export class VicYOrdinalAxisConfig<
  TickValue extends VicDataValue
> extends AbstractYOrdinalConfig<TickValue> {
  constructor(
    options?: Partial<VicYAxisOptions<TickValue>> &
      Partial<VicOrdinalAxisOptions<TickValue>>
  ) {
    super();
    Object.assign(this, options);
  }
}

export function vicYOrdinalAxis<TickValue extends VicDataValue>(
  options?: Partial<
    VicYAxisOptions<TickValue> & Partial<VicOrdinalAxisOptions<TickValue>>
  >
): VicYOrdinalAxisConfig<TickValue> {
  return new VicYOrdinalAxisConfig(options);
}
