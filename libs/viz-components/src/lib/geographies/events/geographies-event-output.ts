import { GeographiesTooltipDatum } from '../config/layers/geographies-layer/geographies-layer';

export interface GeographiesEventOutput<Datum>
  extends GeographiesTooltipDatum<Datum> {
  origin: SVGPathElement;
  positionX: number;
  positionY: number;
}
