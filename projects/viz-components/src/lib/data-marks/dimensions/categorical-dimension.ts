import { InternSet, scaleOrdinal } from 'd3';
import { VicDataDimension, VicDataValue } from './data-dimension';

export class VicCategoricalDimension<
  Datum,
  TCategoricalValue extends VicDataValue
> extends VicDataDimension<Datum, TCategoricalValue> {
  domain: TCategoricalValue[];
  private internSetDomain: InternSet<TCategoricalValue>;
  /**
   * A user-defined function that transforms a category value into a graphical value.
   */
  scale: (category: TCategoricalValue) => string;
  /**
   * An array of graphical values that correspond to the domain.
   *
   * For example, this could be an array of colors or sizes.
   */
  range?: string[];

  constructor(
    init?: Partial<VicCategoricalDimension<Datum, TCategoricalValue>>
  ) {
    super();
    Object.assign(this, init);
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.initDomain();
    this.initScale();
  }

  domainIncludes(value: TCategoricalValue): boolean {
    return this.internSetDomain.has(value);
  }

  private initDomain(): void {
    if (this.domain === undefined) {
      this.domain = this.values;
    }
    this.internSetDomain = new InternSet(this.domain);
    this.domain = [...new InternSet(this.domain)];
  }

  private initScale(): void {
    if (this.scale === undefined) {
      this.scale = scaleOrdinal([...new InternSet(this.domain)], this.range);
    }
  }
}
