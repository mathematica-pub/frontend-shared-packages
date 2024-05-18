import { InternSet, scaleOrdinal, schemeTableau10 } from 'd3';
import {
  VicDataDimension,
  VicDataDimensionOptions,
  VicDataValue,
} from './data-dimension';
import { VicFillPattern } from './fill-pattern';

const DEFAULT = {
  range: schemeTableau10 as string[],
};

export interface VicCategoricalDimensionOptions<
  Datum,
  TCategoricalValue extends VicDataValue = string
> extends VicDataDimensionOptions<Datum, TCategoricalValue> {
  domain: TCategoricalValue[];
  fillPatterns: VicFillPattern<Datum>[];
  /**
   * An array of graphical values that correspond to the domain.
   *
   * For example, this could be an array of colors or sizes.
   */
  range: string[];
  /**
   * A user-defined function that transforms a categorical value into a graphical value.
   */
  scale: (category: TCategoricalValue) => string;
}

export class VicCategoricalDimension<
  Datum,
  TCategoricalValue extends VicDataValue = string
> extends VicDataDimension<Datum, TCategoricalValue> {
  domain: TCategoricalValue[];
  readonly fillPatterns: VicFillPattern<Datum>[];
  private internSetDomain: InternSet<TCategoricalValue>;
  range: string[];
  scale: (category: TCategoricalValue) => string;

  constructor(
    options?: Partial<VicCategoricalDimensionOptions<Datum, TCategoricalValue>>
  ) {
    super();
    Object.assign(this, options);
    this.valueAccessor = this.valueAccessor ?? ((d) => '' as TCategoricalValue);
    this.range = this.range ?? DEFAULT.range;
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

export function vicCategoricalDimension<
  Datum,
  TCategoricalValue extends VicDataValue = string
>(
  options?: Partial<VicCategoricalDimension<Datum, TCategoricalValue>>
): VicCategoricalDimension<Datum, TCategoricalValue> {
  return new VicCategoricalDimension(options);
}
