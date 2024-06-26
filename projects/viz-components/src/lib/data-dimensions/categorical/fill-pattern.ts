export interface VicFillPattern<Datum> {
  name: string;
  usePattern: (d: Datum) => boolean;
}
