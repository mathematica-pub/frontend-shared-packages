import { DataValue } from '../../core/types/values';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis-config';
import { YAxisOptions, mixinYAxisConfig } from '../y/y-axis-config';

const AbstractYOrdinalAxis = mixinYAxisConfig(
  mixinOrdinalAxisConfig(XyAxisConfig)
);

export class YOrdinalAxisConfig<
  TickValue extends DataValue,
> extends AbstractYOrdinalAxis<TickValue> {
  constructor(
    options: YAxisOptions<TickValue> & VicOrdinalAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
