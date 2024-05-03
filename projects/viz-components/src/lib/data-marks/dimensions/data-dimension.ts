import { map } from 'd3';
import { VicFormatSpecifier } from '../../value-format/value-format';

export enum VicDimension {
  'quantitative' = 'quantitative',
  'categorical' = 'categorical',
  'ordinal' = 'ordinal',
  'date' = 'date',
}

export type VicDataValue = number | string | Date;

export abstract class VicDataDimension<Datum, TDataValue extends VicDataValue> {
  values: TDataValue[];
  valueAccessor: (d: Datum, ...args: any) => TDataValue;
  valueFormat?: VicFormatSpecifier<Datum>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract setPropertiesFromData(data: Datum[], ...args: any): void;

  protected setValues(data: Datum[]): void {
    this.values = map(data, this.valueAccessor);
  }
}
