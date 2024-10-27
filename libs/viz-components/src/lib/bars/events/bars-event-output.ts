import { ElementRef } from '@angular/core';
import { DataValue } from '../../core/types/values';

export interface BarsTooltipData<Datum, TOrdinalValue extends DataValue> {
  datum: Datum;
  color: string;
  ordinal: TOrdinalValue;
  quantitative: string;
  category: string;
  elRef: ElementRef;
}

export interface BarsEventOutput<Datum, TOrdinalValue extends DataValue>
  extends BarsTooltipData<Datum, TOrdinalValue> {
  positionX: number;
  positionY: number;
}
