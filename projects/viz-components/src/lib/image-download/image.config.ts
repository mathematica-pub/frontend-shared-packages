import { VicImage } from './image.enums';

export class VicImageServiceConfig {
  filter: (domNode: HTMLElement) => boolean;
  containerNode: HTMLElement;
  fileName: string;
  imageType: string;
  /**
   * Disables external fonts from being read in
   * Supply with custom css fallback; or set to undefined to read external fonts
   * (will oftentimes get security errors)
   */
  fontEmbedCSS = '';
  backgroundColor = '#fff';
  quality = 1;
}

export class VicJpegImageConfig extends VicImageServiceConfig {
  constructor(options?: Partial<VicImageServiceConfig>) {
    super();
    this.imageType = VicImage.jpeg;
    Object.assign(this, options);
  }
}

export class VicPngImageConfig extends VicImageServiceConfig {
  constructor(options?: Partial<VicImageServiceConfig>) {
    super();
    this.imageType = VicImage.png;
    Object.assign(this, options);
  }
}

export class VicSvgImageConfig extends VicImageServiceConfig {
  constructor(options?: Partial<VicImageServiceConfig>) {
    super();
    this.imageType = VicImage.svg;
    Object.assign(this, options);
  }
}
