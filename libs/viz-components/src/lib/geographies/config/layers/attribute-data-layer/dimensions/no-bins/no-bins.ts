import { extent } from 'd3';
import { BinStrategy } from '../attribute-data-bin-enums';
import { AttributeDataDimension } from '../attribute-data/attribute-data-dimension';
import { NoBinsAttributeDataDimensionOptions } from './no-bins-options';

export class NoBinsAttributeDataDimension<Datum> extends AttributeDataDimension<
  Datum,
  number
> {
  override readonly binType: BinStrategy.none;
  domain: [number, number];
  formatSpecifier: string;

  constructor(options: NoBinsAttributeDataDimensionOptions<Datum>) {
    super('number');
    this.binType = BinStrategy.none;
    safeAssign(this, options);
    if (!this.valueAccessor) {
      console.error(
        'Value accessor is required for NoBinsAttributeDataDimension'
      );
    }
  }

  setPropertiesFromData(data: Datum[]): void {
    const values = data.map(this.valueAccessor);
    this.setDomain(values);
  }

  protected setDomain(values: number[]): void {
    const domainValues = this.domain ?? values;
    this.domain = extent(domainValues);
  }

  getScale() {
    return this.scale()
      .domain(this.domain)
      .range(this.range)
      .unknown(this.nullColor);
  }
}
