export interface FillPattern<Datum> {
  name: string;
  usePattern: (d: Datum) => boolean;
}
