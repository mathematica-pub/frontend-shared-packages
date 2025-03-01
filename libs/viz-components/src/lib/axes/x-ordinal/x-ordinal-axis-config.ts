import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis-config';
import { Ticks } from '../ticks/ticks';
import { XAxisOptions, mixinXAxisConfig } from '../x/x-axis-config';

type XyAxisConfigType<T extends DataValue> = AbstractConstructor<
  XyAxisConfig<T, Ticks<T>>
>;

const AbstractXOrdinalAxis = mixinXAxisConfig<
  DataValue,
  Ticks<DataValue>,
  XyAxisConfigType<DataValue>
>(mixinOrdinalAxisConfig<DataValue, XyAxisConfigType<DataValue>>(XyAxisConfig));

export class VicXOrdinalAxisConfig<
  Tick extends DataValue,
> extends AbstractXOrdinalAxis {
  constructor(options: XAxisOptions & VicOrdinalAxisOptions<Tick>) {
    super(options);
  }
}
