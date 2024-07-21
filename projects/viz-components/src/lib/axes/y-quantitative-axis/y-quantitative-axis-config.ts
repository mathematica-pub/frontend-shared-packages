import { DataValue } from '../../core/types/values';
import {
  VicQuantitativeAxisOptions,
  mixinQuantitativeAxisConfig,
} from '../quantitative/quantitative-axis-config';
import { VicXyAxisConfig } from '../xy-axis.config';
import { VicYAxisOptions, mixinYAxisConfig } from '../y/y-axis-config';

const AbstractYQuantitativeConfig = mixinYAxisConfig(
  mixinQuantitativeAxisConfig(VicXyAxisConfig)
);

export class VicYQuantitativeAxisConfig<
  TickValue extends DataValue
> extends AbstractYQuantitativeConfig<TickValue> {
  constructor(
    options: VicYAxisOptions<TickValue> & VicQuantitativeAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
