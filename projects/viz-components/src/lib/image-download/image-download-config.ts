import { VicImage } from './image-download-enums';

export class VicImageDownloadConfig {
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

export class VicJpegImageConfig extends VicImageDownloadConfig {
  constructor(options?: Partial<VicImageDownloadConfig>) {
    super();
    this.imageType = VicImage.jpeg;
    Object.assign(this, options);
  }
}

export class VicPngImageConfig extends VicImageDownloadConfig {
  constructor(options?: Partial<VicImageDownloadConfig>) {
    super();
    this.imageType = VicImage.png;
    Object.assign(this, options);
  }
}

export class VicSvgImageConfig extends VicImageDownloadConfig {
  constructor(options?: Partial<VicImageDownloadConfig>) {
    super();
    this.imageType = VicImage.svg;
    Object.assign(this, options);
  }
}
