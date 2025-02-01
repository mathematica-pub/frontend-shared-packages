export interface PointMarkersOptions<Datum> {
  datumClass: (d: Datum, i: number) => string;
  display: (d: Datum) => boolean;
  growByOnHover: number;
  radius: number;
}
