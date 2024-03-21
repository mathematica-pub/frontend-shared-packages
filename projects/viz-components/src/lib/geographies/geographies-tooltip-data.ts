import { Feature } from 'geojson';
import { formatValue } from '../value-format/value-format';
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

export function getGeographiesTooltipData<Datum>(
  geography: Feature,
  geographies: GeographiesComponent<Datum>
): VicGeographiesTooltipOutput<Datum> {
  const geographyName =
    geographies.config.dataGeographyConfig.featureIndexAccessor(
      geography.properties
    );
  const datum = geographies.values.datumsByGeographyIndex.get(geographyName);
  const value =
    geographies.values.attributeValuesByGeographyIndex.get(geographyName);

  const tooltipData: VicGeographiesTooltipOutput<Datum> = {
    datum,
    geography:
      geographies.config.dataGeographyConfig.attributeDataConfig.geoAccessor(
        datum
      ),
    attributeValue: formatValue(
      value,
      geographies.config.dataGeographyConfig.attributeDataConfig.valueFormat
    ),
    color: geographies.getFill(geographyName),
  };

  return tooltipData;
}
