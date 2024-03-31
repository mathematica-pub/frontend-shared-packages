import * as CSSType from 'csstype';
export class VicColorUtilities {
  static getContrastRatio(foreground: string, background: string): number {
    const lumA = VicColorUtilities.getLuminance(foreground);
    const lumB = VicColorUtilities.getLuminance(background);
    return lumA > lumB
      ? (lumA + 0.05) / (lumB + 0.05)
      : (lumB + 0.05) / (lumA + 0.05);
  }

  static getLuminance(color: string): number {
    const rgb = VicColorUtilities.colorStringToRgbObject(color);
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

  static colorStringToRgbObject(colorString: string): {
    r: number;
    g: number;
    b: number;
  } {
    if (colorString.startsWith('#')) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        colorString.toLowerCase()
      );
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
    } else if (colorString.startsWith('rgb')) {
      const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
      const match = colorString.match(regex);
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
      };
    } else {
      console.error(
        `color string provided could not be parsed, using black: ${colorString}`
      );
      return {
        r: 0,
        g: 0,
        b: 0,
      };
    }
  }

  /**
   * @param backgroundColor string, provided by getFill
   * @param darkColor Cannot use HTML named colors -- the colors used here must be calculable, hex or rgb
   * @param lightColor Same constraints as darkColor
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
