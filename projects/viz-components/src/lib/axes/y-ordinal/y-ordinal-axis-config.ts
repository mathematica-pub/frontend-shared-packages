import { DataValue } from '../../core/types/values';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis-config';
import { VicXyAxisConfig } from '../xy-axis.config';
import { VicYAxisOptions, mixinYAxisConfig } from '../y/y-axis-config';

const AbstractYOrdinalConfig = mixinYAxisConfig(
  mixinOrdinalAxisConfig(VicXyAxisConfig)
);

export class VicYOrdinalAxisConfig<
  TickValue extends DataValue
> extends AbstractYOrdinalConfig<TickValue> {
  constructor(
    options: VicYAxisOptions<TickValue> & VicOrdinalAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
