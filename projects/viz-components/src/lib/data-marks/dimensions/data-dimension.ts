import { map } from 'd3';
import { VicFormatSpecifier } from '../../value-format/value-format';

export enum VicDimension {
  'quantitative' = 'quantitative',
  'categorical' = 'categorical',
  'ordinal' = 'ordinal',
  'date' = 'date',
}

export type VicDataValue = number | string | Date;

export abstract class VicDataDimensionConfig<
  Datum,
  ValueType extends VicDataValue
> {
  values: ValueType[];
  valueAccessor: (d: Datum, ...args: any) => ValueType;
  valueFormat?: VicFormatSpecifier<Datum>;
  constructor(init?: Partial<VicDataDimensionConfig<Datum, ValueType>>) {
    Object.assign(this, init);
  }

  abstract setPropertiesFromData(data: Datum[], ...args: any): void;

  protected setValues(data: Datum[]): void {
    this.values = map(data, this.valueAccessor);
  }
}
