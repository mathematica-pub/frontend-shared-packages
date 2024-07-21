import { DataValue } from '../../core/types/values';
import { XyAxisBaseConfig } from '../base/config/xy-axis-config';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis-config';
import { VicYAxisOptions, mixinYAxisConfig } from '../y/y-axis-config';

const AbstractYOrdinalConfig = mixinYAxisConfig(
  mixinOrdinalAxisConfig(XyAxisBaseConfig)
);

export class YOrdinalAxisConfig<
  TickValue extends DataValue
> extends AbstractYOrdinalConfig<TickValue> {
  constructor(
    options: VicYAxisOptions<TickValue> & VicOrdinalAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
