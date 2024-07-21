import { DataValue } from '../../core/types/values';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis-config';
import { VicXAxisOptions, mixinXAxisConfig } from '../x/x-axis-config';
import { VicXyAxisConfig } from '../xy-axis.config';

const AbstractXOrdinalConfig = mixinXAxisConfig(
  mixinOrdinalAxisConfig(VicXyAxisConfig)
);

export class VicXOrdinalAxisConfig<
  TickValue extends DataValue
> extends AbstractXOrdinalConfig<TickValue> {
  constructor(
    options: VicXAxisOptions<TickValue> & VicOrdinalAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
