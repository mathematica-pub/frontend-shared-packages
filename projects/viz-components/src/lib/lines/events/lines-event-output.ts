export interface LinesTooltipData<Datum> {
  datum: Datum;
  x: string;
  y: string;
  category: string;
  color: string;
}

export interface LinesEventOutput<Datum> extends LinesTooltipData<Datum> {
  positionX: number;
  positionY: number;
}
