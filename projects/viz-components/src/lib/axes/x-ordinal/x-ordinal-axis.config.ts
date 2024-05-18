import { VicDataValue } from '../../data-marks/dimensions/data-dimension';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis.config';
import { VicXAxisOptions, mixinXAxisConfig } from '../x/x-axis.config';
import { VicXyAxisConfig } from '../xy-axis.config';

const AbstractXOrdinalConfig = mixinXAxisConfig(
  mixinOrdinalAxisConfig(VicXyAxisConfig)
);

export class VicXOrdinalAxisConfig<
  TickValue extends VicDataValue
> extends AbstractXOrdinalConfig<TickValue> {
  constructor(
    options?: Partial<VicXAxisOptions<TickValue>> &
      Partial<VicOrdinalAxisOptions<TickValue>>
  ) {
    super();
    Object.assign(this, options);
  }
}

export function vicXOrdinalAxis<TickValue extends VicDataValue>(
  options?: Partial<VicXAxisOptions<TickValue>> &
    Partial<VicOrdinalAxisOptions<TickValue>>
): VicXOrdinalAxisConfig<TickValue> {
  return new VicXOrdinalAxisConfig(options);
}
