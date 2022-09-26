import { Injectable } from '@angular/core';
import * as domToImage from 'html-to-image';
import { ImageServiceConfig } from './image.config';
import { Image } from './image.enums';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  domToImage = domToImage;
  async downloadNode(imageConfig: ImageServiceConfig): Promise<string | void> {
    let dataUrl;
    switch (imageConfig.imageType) {
      case Image.jpeg:
        dataUrl = await this.domToImage.toJpeg(
          imageConfig.containerNode,
          imageConfig
        );
        break;
      case Image.png:
        dataUrl = await this.domToImage.toPng(
          imageConfig.containerNode,
          imageConfig
        );
        break;
      case Image.svg:
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
