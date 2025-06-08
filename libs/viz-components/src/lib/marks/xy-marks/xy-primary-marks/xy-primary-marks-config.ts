import { DataValue } from '../../../core/types/values';
import { PrimaryMarksConfig } from '../../primary-marks/config/primary-marks-config';

export abstract class XyPrimaryMarksConfig<
  Datum,
  ChartMultipleDomain extends DataValue,
> extends PrimaryMarksConfig<Datum, ChartMultipleDomain> {
  valueIndices: number[];

  protected getIndicesByMultiple(): Map<ChartMultipleDomain, number[]> {
    const map = new Map<ChartMultipleDomain, number[]>();
    this.multiples.values.forEach((value, index) => {
      if (!map.has(value)) {
        map.set(value, []);
      }
      map.get(value)!.push(index);
    });
    return map;
  }

  protected isValidMultipleValue(index: number): boolean {
    if (!this.multiples) {
      return true;
    }
    return this.multiples.domainIncludes(this.multiples.values[index]);
  }
}
