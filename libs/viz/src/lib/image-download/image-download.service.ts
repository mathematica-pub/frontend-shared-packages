import { Injectable } from '@angular/core';
import * as domToImage from '@zumer/snapdom';
import {
  VicJpegImageConfig,
  VicPngImageConfig,
  VicSvgImageConfig,
} from './image-download-config';

@Injectable({ providedIn: 'root' })
export class VicImageDownloadService {
  domToImage = domToImage;

  async downloadImage(
    imageConfig: VicJpegImageConfig | VicPngImageConfig | VicSvgImageConfig
  ): Promise<string | void> {
    const result = await domToImage.snapdom(imageConfig.containerNode, {
      embedFonts: true,
      cache: 'full',
    });

    await result.download({
      format: imageConfig.imageType as domToImage.BlobType,
      filename: imageConfig.fileName,
    });
  }
}
