export interface GeographiesTooltipData<Datum> {
  datum?: Datum;
  color: string;
  geography: string;
  attributeValue?: string;
}

export interface GeographiesEventOutput<Datum>
  extends GeographiesTooltipData<Datum> {
  positionX: number;
  positionY: number;
}
