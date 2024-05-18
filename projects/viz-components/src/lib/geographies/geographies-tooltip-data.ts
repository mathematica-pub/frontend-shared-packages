import { Geometry } from 'geojson';
import { formatValue } from '../core/utilities/value-format';
import { VicGeographiesFeature } from './geographies-feature';
import { GeographiesComponent } from './geographies.component';

export interface VicGeographiesTooltipOutput<Datum> {
  datum?: Datum;
  color: string;
  geography: string;
  attributeValue: string;
}

export interface VicGeographiesEventOutput<Datum>
  extends VicGeographiesTooltipOutput<Datum> {
  positionX: number;
  positionY: number;
}

export function getGeographiesTooltipData<
  Datum,
  TProperties,
  TGeometry extends Geometry,
  TComponent extends GeographiesComponent<Datum, TProperties, TGeometry>
>(
  geography: VicGeographiesFeature<TProperties, TGeometry>,
  component: TComponent
): VicGeographiesTooltipOutput<Datum> {
  const geographyName = component.config.featureIndexAccessor(geography);
  const datum =
    component.config.values.datumsByGeographyIndex.get(geographyName);
  const value =
    component.config.values.attributeValuesByGeographyIndex.get(geographyName);

  const tooltipData: VicGeographiesTooltipOutput<Datum> = {
    datum,
    geography:
      component.config.dataGeographies.attributeData.geoAccessor(datum),
    attributeValue: formatValue(
      value,
      component.config.dataGeographies.attributeData.valueFormat
    ),
    color: component.getFill(geographyName),
  };

  return tooltipData;
}
