import { InternMap, stackOffsetDiverging, stackOrderNone } from 'd3';
import { BarsConfig } from '../bars/bars.model';

export class StackedBarsConfig extends BarsConfig {
  order: any;
  offset: any;

  constructor(init?: Partial<StackedBarsConfig>) {
    super();
    this.order = stackOrderNone;
    this.offset = stackOffsetDiverging;
    Object.assign(this, init);
  }
}

export interface StackDatumData {
  data: [string, InternMap];
}

export interface StackDatumIndex {
  i: number;
}

export type StackDatum = [number, number] & StackDatumData & StackDatumIndex;
