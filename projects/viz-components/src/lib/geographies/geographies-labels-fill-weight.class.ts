import * as CSSType from 'csstype';
import { ColorUtilities } from '../shared/color-utilities.class';

/**
 * Any helper classes for the geographies labels' fill or weight go in this file
 */

export interface VicGeographiesLabelsAutoColorProperties {
  /**
   * Cannot use HTML named colors -- the colors used here must be calculable
   * We only support hex or rgb
   */
  color: CSSType.Property.Fill;
  fontWeight: CSSType.Property.FontWeight;
}

export class VicGeographiesLabelsAutoColor {
  dark: VicGeographiesLabelsAutoColorProperties;
  light: VicGeographiesLabelsAutoColorProperties;

  constructor(init?: Partial<VicGeographiesLabelsAutoColor>) {
    this.dark = {
      color: '#000000',
      fontWeight: 700,
    };
    this.light = {
      color: '#FFFFFF',
      fontWeight: 400,
    };
    // eslint-disable-next-line no-self-assign
    this.getAutoContrastLabelProperties = this.getAutoContrastLabelProperties;
    Object.assign(this, init);
  }

  getAutoContrastLabelProperties(
    backgroundColor: string
  ): VicGeographiesLabelsAutoColorProperties {
    return ColorUtilities.getContrastRatio(this.light.color, backgroundColor) >
      ColorUtilities.getContrastRatio(this.dark.color, backgroundColor)
      ? this.light
      : this.dark;
  }
}
