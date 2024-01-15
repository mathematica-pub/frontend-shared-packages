import { formatValue } from '../value-format/value-format';
import { GeographiesComponent } from './geographies.component';

export interface VicGeographiesTooltipOutput<T> {
  datum?: T;
  color: string;
  geography: string;
  attributeValue: string;
}

export interface VicGeographiesEventOutput<T>
  extends VicGeographiesTooltipOutput<T> {
  positionX: number;
  positionY: number;
}

export function getGeographiesTooltipData<T>(
  geographyIndex: number,
  geographies: GeographiesComponent<T>
): VicGeographiesTooltipOutput<T> {
  const datum = geographies.config.data.find(
    (d) =>
      geographies.config.dataGeographyConfig.attributeDataConfig
        .geoAccessor(d)
        .toLowerCase() ===
      geographies.values.attributeDataGeographies[geographyIndex]
  );

  const tooltipData: VicGeographiesTooltipOutput<T> = {
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
