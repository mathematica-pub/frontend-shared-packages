import { formatValue } from '../value-format/value-format';
import { GeographiesComponent } from './geographies.component';

export interface GeographiesTooltipOutput {
  datum?: any;
  color: string;
  geography: string;
  attributeValue: string;
}

export interface GeographiesEventOutput extends GeographiesTooltipOutput {
  positionX: number;
  positionY: number;
}

export function getGeographiesTooltipData(
  geographyIndex: number,
  geographies: GeographiesComponent
): GeographiesTooltipOutput {
  const datum = geographies.config.data.find(
    (d) =>
      geographies.config.dataGeographyConfig.attributeDataConfig
        .geoAccessor(d)
        .toLowerCase() ===
      geographies.values.attributeDataGeographies[geographyIndex]
  );

  const tooltipData: GeographiesTooltipOutput = {
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
