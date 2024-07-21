import { DataValue } from '../../core/types/values';
import { XyAxisBaseConfig } from '../base/config/xy-axis-config';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis-config';
import { VicXAxisOptions, mixinXAxisConfig } from '../x/x-axis-config';

const AbstractXOrdinalConfig = mixinXAxisConfig(
  mixinOrdinalAxisConfig(XyAxisBaseConfig)
);

export class XOrdinalAxisConfig<
  TickValue extends DataValue
> extends AbstractXOrdinalConfig<TickValue> {
  constructor(
    options: VicXAxisOptions<TickValue> & VicOrdinalAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
