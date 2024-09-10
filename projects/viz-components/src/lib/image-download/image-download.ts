import { Injectable } from '@angular/core';
import * as domToImage from 'html-to-image';
import {
  VicJpegImageConfig,
  VicPngImageConfig,
  VicSvgImageConfig,
} from './image-download-config';
import { VicImage } from './image-download-enums';

@Injectable({ providedIn: 'root' })
export class VicImageDownload {
  domToImage = domToImage;

  /**
   * @param imageConfig
   * @returns fontEmbedCSS -- scans stylesheets for font files and base64 encodes them,
   * reuse this value in imageConfig for subsequent downloads to avoid
   * re-encoding fonts (slight performance boost)
   */
  async downloadNode(
    imageConfig: VicJpegImageConfig | VicPngImageConfig | VicSvgImageConfig
  ): Promise<string | void> {
    let dataUrl;
    if (imageConfig.fontEmbedCSS === undefined) {
      imageConfig.fontEmbedCSS = await domToImage.getFontEmbedCSS(
        imageConfig.containerNode
      );
    }
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
    return imageConfig.fontEmbedCSS;
  }

  createLinkAndClick(dataUrl: string, fileName: string) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  }
}
