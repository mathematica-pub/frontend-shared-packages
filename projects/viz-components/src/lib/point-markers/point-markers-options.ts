export interface PointMarkersOptions<Datum> {
  display: (d: Datum) => boolean;
  class: string;
  growByOnHover: number;
  radius: number;
}
