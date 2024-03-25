import { Geometry } from 'geojson';
import { formatValue } from '../value-format/value-format';
import { GeographiesComponent } from './geographies.component';
import { GeographiesFeature } from './geographies.config';

export class VicGeographiesTooltipOutput<Datum> {
  datum?: Datum;
  color: string;
  geography: string;
  attributeValue: string;

  constructor(init?: Partial<VicGeographiesTooltipOutput<Datum>>) {
    Object.assign(this, init);
  }
}

export class VicGeographiesEventOutput<
  Datum
> extends VicGeographiesTooltipOutput<Datum> {
  positionX: number;
  positionY: number;

  constructor(init?: Partial<VicGeographiesEventOutput<Datum>>) {
    super(init);
    Object.assign(this, init);
  }
}

export function getGeographiesTooltipData<
  Datum,
  P,
  G extends Geometry,
  C extends GeographiesComponent<Datum, P, G>
>(
  geography: GeographiesFeature<P, G>,
  component: C
): VicGeographiesTooltipOutput<Datum> {
  const geographyName = component.config.featureIndexAccessor(geography);
  const datum = component.values.datumsByGeographyIndex.get(geographyName);
  const value =
    component.values.attributeValuesByGeographyIndex.get(geographyName);

  const tooltipData: VicGeographiesTooltipOutput<Datum> = {
    datum,
    geography:
      component.config.dataGeographyConfig.attributeDataConfig.geoAccessor(
        datum
      ),
    attributeValue: formatValue(
      value,
      component.config.dataGeographyConfig.attributeDataConfig.valueFormat
    ),
    color: component.getFill(geographyName),
  };

  return tooltipData;
}
