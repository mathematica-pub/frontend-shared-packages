import { InternMap, stackOffsetDiverging, stackOrderNone } from 'd3';
import { VicBarsConfig } from '../bars/bars.config';

export class VicStackedBarsConfig<T> extends VicBarsConfig<T> {
  order: any;
  offset: any;

  constructor(init?: Partial<VicStackedBarsConfig<T>>) {
    super();
    this.order = stackOrderNone;
    this.offset = stackOffsetDiverging;
    Object.assign(this, init);
  }
}

export interface VicStackDatumData {
  data: [string, InternMap];
}

export interface VicStackDatumIndex {
  i: number;
}

export type VicStackDatum = [number, number] &
  VicStackDatumData &
  VicStackDatumIndex;
