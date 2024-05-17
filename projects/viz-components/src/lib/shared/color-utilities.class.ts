import * as CSSType from 'csstype';
import { color as d3Color } from 'd3-color';
export class VicColorUtilities {
  static getContrastRatio(foreground: string, background: string): number {
    const lumA = VicColorUtilities.getLuminance(foreground);
    const lumB = VicColorUtilities.getLuminance(background);
    return lumA > lumB
      ? (lumA + 0.05) / (lumB + 0.05)
      : (lumB + 0.05) / (lumA + 0.05);
  }

  static getLuminance(color: string): number {
    const rgb = d3Color(color).rgb();
    return (
      0.2126 * VicColorUtilities.sRGBToLinear(rgb.r) +
      0.7152 * VicColorUtilities.sRGBToLinear(rgb.g) +
      0.0722 * VicColorUtilities.sRGBToLinear(rgb.b)
    );
  }

  static sRGBToLinear(value: number): number {
    const v = value / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  /**
   * @param backgroundColor string, provided by getFill
   * @param darkColor
   * @param lightColor
   * @returns label fill color (either dark or light color)
   */
  static getHigherContrastColorForBackground(
    backgroundColor: string,
    darkColor: CSSType.Property.Fill,
    lightColor: CSSType.Property.Fill
  ): CSSType.Property.Fill {
    return VicColorUtilities.getContrastRatio(lightColor, backgroundColor) >
      VicColorUtilities.getContrastRatio(darkColor, backgroundColor)
      ? lightColor
      : darkColor;
  }
}
