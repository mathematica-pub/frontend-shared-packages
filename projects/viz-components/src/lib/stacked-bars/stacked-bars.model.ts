import { InternMap, stackOffsetDiverging, stackOrderNone } from 'd3';
import { BarsConfig } from '../bars/bars.model';

export class StackedBarsConfig extends BarsConfig {
  order: any;
  offset: any;

  constructor() {
    super();
    this.order = stackOrderNone;
    this.offset = stackOffsetDiverging;
  }
}

export interface StackDatumData {
  data: [string, InternMap];
}

export interface StackDatumIndex {
  i: number;
}

export type StackDatum = [number, number] & StackDatumData & StackDatumIndex;
