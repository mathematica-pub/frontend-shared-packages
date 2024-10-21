import { ElementRef } from '@angular/core';

export interface DotsTooltipData<Datum> {
  datum: Datum;
  values: {
    x: string;
    y: string;
    fill: string | number;
    radius: string | number;
  };
  color: string;
  elRef: ElementRef;
}

export interface DotsEventOutput<Datum> extends DotsTooltipData<Datum> {
  positionX: number;
  positionY: number;
}
