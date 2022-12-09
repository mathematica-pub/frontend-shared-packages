import { formatValue } from '../../public-api';
import { EventEffect } from '../events/effect';
import {
  GeographiesHoverAndMoveEmittedOutput,
  GeographiesHoverAndMoveEventDirective,
} from './geographies-hover-move-event.directive';

export class GeographiesHoverAndMoveEffectEmitTooltipData
  implements EventEffect<GeographiesHoverAndMoveEventDirective>
{
  applyEffect(directive: GeographiesHoverAndMoveEventDirective): void {
    const datum = directive.geographies.config.data.find(
      (d) =>
        directive.geographies.config.dataGeographyConfig.attributeDataConfig
          .geoAccessor(d)
          .toLowerCase() ===
        directive.geographies.values.attributeDataGeographies[
          directive.geographyIndex
        ]
    );

    const tooltipData: GeographiesHoverAndMoveEmittedOutput = {
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
      positionX: directive.pointerX,
      positionY: directive.pointerY,
    };

    directive.hoverAndMoveEventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverAndMoveEventDirective): void {
    directive.hoverAndMoveEventOutput.emit(null);
  }
}
