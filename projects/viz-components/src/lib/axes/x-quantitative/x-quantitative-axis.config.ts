import { VicDataValue } from '../../core/types/values';
import {
  VicQuantitativeAxisOptions,
  mixinQuantitativeAxisConfig,
} from '../quantitative/quantitative-axis.config';
import { VicXAxisOptions, mixinXAxisConfig } from '../x/x-axis.config';
import { VicXyAxisConfig } from '../xy-axis.config';

const AbstractXQuantitativeConfig = mixinXAxisConfig(
  mixinQuantitativeAxisConfig(VicXyAxisConfig)
);

export class VicXQuantitativeAxisConfig<
  TickValue extends VicDataValue
> extends AbstractXQuantitativeConfig<TickValue> {
  constructor(
    options: VicXAxisOptions<TickValue> & VicQuantitativeAxisOptions<TickValue>
  ) {
    super();
    Object.assign(this, options);
  }
}
