import { Injectable } from '@angular/core';
import * as domToImage from 'html-to-image';
import { VicImageServiceConfig } from './image.config';
import { VicImage } from './image.enums';

@Injectable()
export class VicImageService {
  domToImage = domToImage;
  async downloadNode(
    imageConfig: VicImageServiceConfig
  ): Promise<string | void> {
    let dataUrl;
    const sizedImageConfig = {
      ...imageConfig,
      width: imageConfig.containerNode.scrollWidth,
      height: imageConfig.containerNode.scrollHeight,
    };
    switch (imageConfig.imageType) {
      case VicImage.jpeg:
        dataUrl = await this.domToImage.toJpeg(
          imageConfig.containerNode,
          sizedImageConfig
        );
        break;
      case VicImage.png:
        dataUrl = await this.domToImage.toPng(
          imageConfig.containerNode,
          sizedImageConfig
        );
        break;
      case VicImage.svg:
        dataUrl = await this.domToImage.toSvg(
          imageConfig.containerNode,
          sizedImageConfig
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
