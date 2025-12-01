import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { ContinuousValue } from '../../core/types/values';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import {
  VicQuantitativeAxisOptions,
  mixinQuantitativeAxisConfig,
} from '../quantitative/quantitative-axis-config';
import { QuantitativeTicks } from '../ticks/ticks';
import { XAxisOptions, mixinXAxisConfig } from '../x/x-axis-config';

type XyAxisConfigType<T extends ContinuousValue> = AbstractConstructor<
  XyAxisConfig<T, QuantitativeTicks<T>>
>;

const AbstractXQuantitativeAxis = mixinXAxisConfig<
  ContinuousValue,
  QuantitativeTicks<ContinuousValue>,
  XyAxisConfigType<ContinuousValue>
>(
  mixinQuantitativeAxisConfig<
    ContinuousValue,
    XyAxisConfigType<ContinuousValue>
  >(XyAxisConfig)
);

export class VicXQuantitativeAxisConfig<
  Tick extends ContinuousValue,
> extends AbstractXQuantitativeAxis {
  constructor(options: XAxisOptions & VicQuantitativeAxisOptions<Tick>) {
    super(options);
  }
}
