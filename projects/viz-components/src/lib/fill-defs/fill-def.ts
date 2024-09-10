export interface FillDef<Datum> {
  name: string;
  usePattern: (d: Datum) => boolean;
}
