import { VicDataValue } from '../../core/types/values';
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
