import { formatValue } from '../value-format/value-format';
import { GeographiesComponent } from './geographies.component';

export interface GeographiesEmittedOutput {
  datum?: any;
  color: string;
  geography: string;
  attributeValue: string;
  bounds?: [[number, number], [number, number]];
  positionX?: number;
  positionY?: number;
}

export function getGeographiesTooltipData(
  geographyIndex: number,
  geographies: GeographiesComponent
): GeographiesEmittedOutput {
  const datum = geographies.config.data.find(
    (d) =>
      geographies.config.dataGeographyConfig.attributeDataConfig
        .geoAccessor(d)
        .toLowerCase() ===
      geographies.values.attributeDataGeographies[geographyIndex]
  );

  const tooltipData: GeographiesEmittedOutput = {
    datum,
    geography:
      geographies.config.dataGeographyConfig.attributeDataConfig.geoAccessor(
        datum
      ),
    attributeValue: formatValue(
      geographies.values.attributeDataValues[geographyIndex],
      geographies.config.dataGeographyConfig.attributeDataConfig.valueFormat
    ),
    color: geographies.getFill(geographyIndex),
  };

  return tooltipData;
}
