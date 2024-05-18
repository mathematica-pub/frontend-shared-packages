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
    options?: Partial<VicXAxisOptions<TickValue>> &
      Partial<VicQuantitativeAxisOptions<TickValue>>
  ) {
    super();
    Object.assign(this, options);
  }
}

export function vicXQuantitativeAxis<TickValue extends VicDataValue>(
  options?: Partial<VicXAxisOptions<TickValue>> &
    Partial<VicQuantitativeAxisOptions<TickValue>>
): VicXQuantitativeAxisConfig<TickValue> {
  return new VicXQuantitativeAxisConfig(options);
}
