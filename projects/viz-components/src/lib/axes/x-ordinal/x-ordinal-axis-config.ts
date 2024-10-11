import { DataValue } from '../../core/types/values';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis-config';
import { XAxisOptions, mixinXAxisConfig } from '../x/x-axis-config';

const AbstractXOrdinalAxis = mixinXAxisConfig(
  mixinOrdinalAxisConfig(XyAxisConfig)
);

export class XOrdinalAxisConfig<
  TickValue extends DataValue,
> extends AbstractXOrdinalAxis<TickValue> {
  constructor(
    options: XAxisOptions<TickValue> & VicOrdinalAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
