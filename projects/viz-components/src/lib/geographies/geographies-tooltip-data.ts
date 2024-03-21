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
  geographyIndex: number,
  geographies: GeographiesComponent<Datum>
): VicGeographiesTooltipOutput<Datum> {
  const datum = geographies.config.data.find(
    (d) =>
      geographies.config.dataGeographyConfig.attributeDataConfig
        .geoAccessor(d)
        .toLowerCase() ===
      geographies.values.attributeDataGeographies[geographyIndex]
  );

  const tooltipData: VicGeographiesTooltipOutput<Datum> = {
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
