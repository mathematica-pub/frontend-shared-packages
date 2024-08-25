import { VicImage } from './image-download-enums';
import { ImageDownloadOptions } from './image-download-options';

const DEFAULT = {
  fontEmbedCSS: '',
  backgroundColor: '#fff',
  quality: 1,
};

export class VicJpegImageConfig implements ImageDownloadOptions {
  backgroundColor: string;
  containerNode: HTMLElement;
  fileName: string;
  filter: (domNode: HTMLElement) => boolean;
  fontEmbedCSS: string;
  imageType: string;
  quality: number;

  constructor(options?: Partial<ImageDownloadOptions>) {
    Object.assign(this, DEFAULT, options);
    this.imageType = VicImage.jpeg;
  }
}

export class VicPngImageConfig implements ImageDownloadOptions {
  backgroundColor: string;
  containerNode: HTMLElement;
  fileName: string;
  filter: (domNode: HTMLElement) => boolean;
  fontEmbedCSS: string;
  imageType: string;
  quality: number;

  constructor(options?: Partial<ImageDownloadOptions>) {
    Object.assign(this, DEFAULT, options);
    this.imageType = VicImage.png;
  }
}

export class VicSvgImageConfig implements ImageDownloadOptions {
  backgroundColor: string;
  containerNode: HTMLElement;
  fileName: string;
  filter: (domNode: HTMLElement) => boolean;
  fontEmbedCSS: string;
  imageType: string;
  quality: number;

  constructor(options?: Partial<ImageDownloadOptions>) {
    Object.assign(this, DEFAULT, options);
    this.imageType = VicImage.svg;
  }
}
