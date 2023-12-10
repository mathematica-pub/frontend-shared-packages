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
  geographyIndex: number,
  geographies: GeographiesComponent
): VicGeographiesTooltipOutput {
  const datum = geographies.config.data.find(
    (d) =>
      geographies.config.dataGeographyConfig.attributeDataConfig
        .geoAccessor(d)
        .toLowerCase() ===
      geographies.values.attributeDataGeographies[geographyIndex]
  );

  const tooltipData: VicGeographiesTooltipOutput = {
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
