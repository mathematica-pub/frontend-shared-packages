import { format, timeFormat } from 'd3';
import { GeographiesHoverAndMoveEffect } from './geographies-effect';
import {
  GeographiesEmittedOutput,
  GeographiesHoverAndMoveEventDirective,
} from './geographies-hover-move-event.directive';

export class EmitGeographiesTooltipData
  implements GeographiesHoverAndMoveEffect
{
  applyEffect(event: GeographiesHoverAndMoveEventDirective): void {
    const datum = event.geographies.config.data.find(
      (d) =>
        event.geographies.config.dataGeographyConfig.attributeDataConfig
          .geoAccessor(d)
          .toLowerCase() ===
        event.geographies.values.attributeDataGeographies[event.geographyIndex]
    );
    const tooltipData: GeographiesEmittedOutput = {
      datum,
      geography:
        event.geographies.config.dataGeographyConfig.attributeDataConfig.geoAccessor(
          datum
        ),
      attributeValue: this.formatValue(
        event.geographies.values.attributeDataValues[event.geographyIndex],
        event.geographies.config.dataGeographyConfig.attributeDataConfig
          .valueFormat
      ),
      color: event.geographies.getFill(event.geographyIndex),
      positionX: event.pointerX,
      positionY: event.pointerY,
    };
    event.hoverAndMoveEventOutput.emit(tooltipData);
  }

  removeEffect(event: GeographiesHoverAndMoveEventDirective): void {
    event.hoverAndMoveEventOutput.emit(null);
  }

  formatValue(value: any, formatSpecifier: string): string {
    const formatter = value instanceof Date ? timeFormat : format;
    if (formatSpecifier) {
      return formatter(formatSpecifier)(value);
    } else {
      return value.toString();
    }
  }
}
