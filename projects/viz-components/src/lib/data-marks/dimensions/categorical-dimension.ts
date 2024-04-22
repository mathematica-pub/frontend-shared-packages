import { InternSet, scaleOrdinal } from 'd3';
import { VicDataDimensionConfig } from './data-dimension';

export class VicCategoricalDimensionConfig<
  Datum,
  TCategoricalValue extends number | string
> extends VicDataDimensionConfig<Datum, string> {
  /**
   * A user-defined function that transforms a category value into a graphical value.
   */
  scale?: (category: string) => TCategoricalValue;
  /**
   * An array of graphical values that correspond to the domain.
   *
   * For example, this could be an array of colors or sizes.
   */
  range?: TCategoricalValue[];

  constructor(
    init?: Partial<VicCategoricalDimensionConfig<Datum, TCategoricalValue>>
  ) {
    super();
    Object.assign(this, init);
  }

  initDomain(): void {
    if (this.domain === undefined) {
      this.domain = this.values;
    }
    this.domain = [...new InternSet(this.domain)];
  }

  initScale(): void {
    if (this.scale === undefined) {
      this.scale = scaleOrdinal([...new InternSet(this.domain)], this.range);
    }
  }
}
