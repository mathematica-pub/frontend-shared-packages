import { GeographiesTooltipDatum } from '../config/layers/geographies-layer/geographies-layer';

export interface GeographiesEventOutput<Datum>
  extends GeographiesTooltipDatum<Datum> {
  positionX: number;
  positionY: number;
}
