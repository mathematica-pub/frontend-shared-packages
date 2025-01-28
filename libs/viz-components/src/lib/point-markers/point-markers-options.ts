export interface PointMarkersOptions<Datum> {
  display: (d: Datum) => boolean;
  growByOnHover: number;
  radius: number;
}
