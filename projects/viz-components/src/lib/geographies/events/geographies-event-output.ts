export interface GeographiesTooltipOutput<Datum> {
  datum?: Datum;
  color: string;
  geography: string;
  attributeValue?: string;
}

export interface GeographiesEventOutput<Datum>
  extends GeographiesTooltipOutput<Datum> {
  positionX: number;
  positionY: number;
}
