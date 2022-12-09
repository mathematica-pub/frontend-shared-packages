import { formatValue } from '../core/constants/string-formatting.constants';
import { EventEffect } from '../events/effect';
import {
  GeographiesHoverEmittedOutput,
  GeographiesHoverEventDirective,
} from './geographies-hover-event.directive';

export class GeographiesHoverEffectEmitTooltipData
  implements EventEffect<GeographiesHoverEventDirective>
{
  applyEffect(directive: GeographiesHoverEventDirective): void {
    const datum = directive.geographies.config.data.find(
      (d) =>
        directive.geographies.config.dataGeographyConfig.attributeDataConfig
          .geoAccessor(d)
          .toLowerCase() ===
        directive.geographies.values.attributeDataGeographies[
          directive.geographyIndex
        ]
    );

    const tooltipData: GeographiesHoverEmittedOutput = {
      datum,
      geography:
        directive.geographies.config.dataGeographyConfig.attributeDataConfig.geoAccessor(
          datum
        ),
      attributeValue: formatValue(
        directive.geographies.values.attributeDataValues[
          directive.geographyIndex
        ],
        directive.geographies.config.dataGeographyConfig.attributeDataConfig
          .valueFormat
      ),
      color: directive.geographies.getFill(directive.geographyIndex),
      bounds: directive.bounds,
    };

    directive.hoverEventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverEventDirective): void {
    directive.hoverEventOutput.emit(null);
  }
}
