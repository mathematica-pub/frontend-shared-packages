import { Feature } from 'geojson';
import { formatValue } from '../value-format/value-format';
import { GeographiesComponent } from './geographies.component';

export interface VicGeographiesTooltipOutput {
  datum?: any;
  color: string;
  geography: string;
  attributeValue: string;
}

export interface VicGeographiesEventOutput extends VicGeographiesTooltipOutput {
  positionX: number;
  positionY: number;
}

export function getGeographiesTooltipData(
  geography: Feature,
  geographies: GeographiesComponent
): VicGeographiesTooltipOutput {
  const geographyName =
    geographies.config.dataGeographyConfig.valueAccessor(geography);
  const datum = geographies.values.geoDatumValueMap.get(geographyName);
  const value = geographies.values.geoDataValueMap.get(geographyName);

  const tooltipData: VicGeographiesTooltipOutput = {
    datum,
    geography:
      geographies.config.dataGeographyConfig.attributeDataConfig.geoAccessor(
        datum
      ),
    attributeValue: formatValue(
      value,
      geographies.config.dataGeographyConfig.attributeDataConfig.valueFormat
    ),
    color: geographies.getFill(geography),
  };

  return tooltipData;
}
