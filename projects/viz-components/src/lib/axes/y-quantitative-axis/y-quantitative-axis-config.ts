import { DataValue } from '../../core/types/values';
import { XyAxisBaseConfig } from '../base/config/xy-axis-config';
import {
  VicQuantitativeAxisOptions,
  mixinQuantitativeAxisConfig,
} from '../quantitative/quantitative-axis-config';
import { YAxisOptions, mixinYAxisConfig } from '../y/y-axis-config';

const AbstractYQuantitative = mixinYAxisConfig(
  mixinQuantitativeAxisConfig(XyAxisBaseConfig)
);

export class YQuantitativeAxisConfig<
  TickValue extends DataValue
> extends AbstractYQuantitative<TickValue> {
  constructor(
    options: YAxisOptions<TickValue> & VicQuantitativeAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
