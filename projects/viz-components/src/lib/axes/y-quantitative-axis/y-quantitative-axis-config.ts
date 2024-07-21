import { DataValue } from '../../core/types/values';
import { XyAxisConfig } from '../config/xy-axis-config';
import {
  VicQuantitativeAxisOptions,
  mixinQuantitativeAxisConfig,
} from '../quantitative/quantitative-axis-config';
import { VicYAxisOptions, mixinYAxisConfig } from '../y/y-axis-config';

const AbstractYQuantitativeConfig = mixinYAxisConfig(
  mixinQuantitativeAxisConfig(XyAxisConfig)
);

export class YQuantitativeAxisConfig<
  TickValue extends DataValue
> extends AbstractYQuantitativeConfig<TickValue> {
  constructor(
    options: VicYAxisOptions<TickValue> & VicQuantitativeAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
