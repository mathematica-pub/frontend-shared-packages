import { DataValue } from '../../core/types/values';
import { XyAxisBaseConfig } from '../base/config/xy-axis-config';
import {
  VicQuantitativeAxisOptions,
  mixinQuantitativeAxisConfig,
} from '../quantitative/quantitative-axis-config';
import { XAxisOptions, mixinXAxisConfig } from '../x/x-axis-config';

const AbstractXQuantitativeAxis = mixinXAxisConfig(
  mixinQuantitativeAxisConfig(XyAxisBaseConfig)
);

export class XQuantitativeAxisConfig<
  TickValue extends DataValue
> extends AbstractXQuantitativeAxis<TickValue> {
  constructor(
    options: XAxisOptions<TickValue> & VicQuantitativeAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
