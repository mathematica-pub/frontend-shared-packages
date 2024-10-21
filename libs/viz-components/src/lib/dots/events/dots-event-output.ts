export interface DotsTooltipData<
  Datum,
  Color extends string | number,
  Radius extends string | number,
> {
  datum: Datum;
  values: {
    x: string;
    y: string;
    color: Color;
    radius: Radius;
  };
  color: string;
}

export interface DotsEventOutput<
  Datum,
  Color extends string | number,
  Radius extends string | number,
> extends DotsTooltipData<Datum, Color, Radius> {
  positionX: number;
  positionY: number;
}
