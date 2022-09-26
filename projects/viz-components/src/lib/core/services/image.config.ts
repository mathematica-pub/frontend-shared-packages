import { Image } from './image.enums';
// (partial) config options from documentation: https://www.npmjs.com/package/html-to-image
export class ImageServiceConfig {
  filter: (domNode: HTMLElement) => boolean;
  containerNode: HTMLElement;
  fileName: string;
  imageType: string;
  backgroundColor = '#fff';
  quality = 1;
}

export class JpegImageConfig extends ImageServiceConfig {
  constructor(init?: Partial<ImageServiceConfig>) {
    super();
    this.imageType = Image.jpeg;
    Object.assign(this, init);
  }
}

export class PngImageConfig extends ImageServiceConfig {
  constructor(init?: Partial<ImageServiceConfig>) {
    super();
    this.imageType = Image.png;
    Object.assign(this, init);
  }
}

export class SvgImageConfig extends ImageServiceConfig {
  constructor(init?: Partial<ImageServiceConfig>) {
    super();
    this.imageType = Image.svg;
    Object.assign(this, init);
  }
}
