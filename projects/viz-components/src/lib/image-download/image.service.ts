import { Injectable } from '@angular/core';
import * as domToImage from 'html-to-image';
import { VicImageServiceConfig } from './image.config';
import { VicImage } from './image.enums';

@Injectable({
  providedIn: 'root',
})
export class VicImageService {
  domToImage = domToImage;
  async downloadNode(
    imageConfig: VicImageServiceConfig
  ): Promise<string | void> {
    let dataUrl;
    switch (imageConfig.imageType) {
      case VicImage.jpeg:
        dataUrl = await this.domToImage.toJpeg(
          imageConfig.containerNode,
          imageConfig
        );
        break;
      case VicImage.png:
        dataUrl = await this.domToImage.toPng(
          imageConfig.containerNode,
          imageConfig
        );
        break;
      case VicImage.svg:
        dataUrl = await this.domToImage.toSvg(
          imageConfig.containerNode,
          imageConfig
        );
        break;
      default:
        break;
    }

    this.createLinkAndClick(
      dataUrl,
      `${imageConfig.fileName}.${imageConfig.imageType}`
    );
  }

  createLinkAndClick(dataUrl: string, fileName: string) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  }
}
