import * as CSSType from 'csstype';
import { ColorUtilities } from '../shared/color-utilities.class';

export class VicGeographiesLabelsFill {
  /**
   * @param backgroundColor string, provided by getFill
   * @param darkColor Cannot use HTML named colors -- the colors used here must be calculable, hex or rgb
   * @param lightColor Same constraints as darkColor
   * @returns label fill color (either dark or light color)
   */
  static getContrastLabelFill(
    backgroundColor: string,
    darkColor: CSSType.Property.Fill,
    lightColor: CSSType.Property.Fill
  ): CSSType.Property.Fill {
    return ColorUtilities.getContrastRatio(lightColor, backgroundColor) >
      ColorUtilities.getContrastRatio(darkColor, backgroundColor)
      ? lightColor
      : darkColor;
  }
}
