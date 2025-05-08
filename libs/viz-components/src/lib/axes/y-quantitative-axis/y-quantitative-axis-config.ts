import { safeAssign } from '@hsi/app-dev-kit';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { ContinuousValue } from '../../core/types/values';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import {
  VicQuantitativeAxisOptions,
  mixinQuantitativeAxisConfig,
} from '../quantitative/quantitative-axis-config';
import { QuantitativeTicks } from '../ticks/ticks';
import { YAxisOptions, mixinYAxisConfig } from '../y/y-axis-config';

type XyAxisConfigType<T extends ContinuousValue> = AbstractConstructor<
  XyAxisConfig<T, QuantitativeTicks<T>>
>;

const AbstractYQuantitative = mixinYAxisConfig<
  ContinuousValue,
  QuantitativeTicks<ContinuousValue>,
  XyAxisConfigType<ContinuousValue>
>(
  mixinQuantitativeAxisConfig<
    ContinuousValue,
    XyAxisConfigType<ContinuousValue>
  >(XyAxisConfig)
);

export class VicYQuantitativeAxisConfig<
  Tick extends ContinuousValue,
> extends AbstractYQuantitative {
  constructor(options: YAxisOptions & VicQuantitativeAxisOptions<Tick>) {
    super();
    safeAssign(this, options);
  }
}
