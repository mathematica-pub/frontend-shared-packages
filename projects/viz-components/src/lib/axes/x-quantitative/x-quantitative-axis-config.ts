import { DataValue } from '../../core/types/values';
import { XyAxisBaseConfig } from '../base/config/xy-axis-config';
import {
  VicQuantitativeAxisOptions,
  mixinQuantitativeAxisConfig,
} from '../quantitative/quantitative-axis-config';
import { VicXAxisOptions, mixinXAxisConfig } from '../x/x-axis-config';

const AbstractXQuantitativeConfig = mixinXAxisConfig(
  mixinQuantitativeAxisConfig(XyAxisBaseConfig)
);

export class XQuantitativeAxisConfig<
  TickValue extends DataValue
> extends AbstractXQuantitativeConfig<TickValue> {
  constructor(
    options: VicXAxisOptions<TickValue> & VicQuantitativeAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
