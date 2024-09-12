export interface FillDef<Datum> {
  name: string;
  useDef: (d: Datum) => boolean;
}
