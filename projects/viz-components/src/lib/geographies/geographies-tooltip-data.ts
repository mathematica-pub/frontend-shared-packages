export interface VicGeographiesTooltipOutput<Datum> {
  datum?: Datum;
  color: string;
  geography: string;
  attributeValue?: string;
}

export interface VicGeographiesEventOutput<Datum>
  extends VicGeographiesTooltipOutput<Datum> {
  positionX: number;
  positionY: number;
}
