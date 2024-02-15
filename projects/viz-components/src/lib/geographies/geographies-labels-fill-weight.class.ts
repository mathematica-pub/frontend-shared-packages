import * as CSSType from 'csstype';
import { ColorUtilities } from '../shared/color-utilities.class';

/**
 * Any helper classes for the geographies labels' fill or weight go in this file
 */

export interface VicGeographiesLabelsAutoColorProperties {
  color: CSSType.Property.Fill; // cannot used HTML named colors
  fontWeight: CSSType.Property.FontWeight;
}

export class VicGeographiesLabelsAutoColor {
  dark: VicGeographiesLabelsAutoColorProperties;
  light: VicGeographiesLabelsAutoColorProperties;

  constructor(init?: Partial<VicGeographiesLabelsAutoColor>) {
    this.dark = {
      color: 'rgb(0,0,0)',
      fontWeight: 700,
    };
    this.light = {
      color: 'rgb(255,255,255)',
      fontWeight: 400,
    };
    Object.assign(this, init);
  }

  getAutoContrastLabelProperties(
    backgroundColor: string
  ): VicGeographiesLabelsAutoColorProperties {
    const lightContrastRatio = ColorUtilities.getContrastRatio(
      this.light.color,
      backgroundColor
    );
    const darkContrastRatio = ColorUtilities.getContrastRatio(
      this.dark.color,
      backgroundColor
    );
    return ColorUtilities.getContrastRatio(this.light.color, backgroundColor) >
      ColorUtilities.getContrastRatio(this.dark.color, backgroundColor)
      ? this.light
      : this.dark;
  }
}
