import { Injectable } from '@angular/core';
import type { BlobType, SnapdomOptions } from '@zumer/snapdom';
import { snapdom } from '@zumer/snapdom';
import {
  VicJpegImageConfig,
  VicPngImageConfig,
  VicSvgImageConfig,
} from './image-download-config';

@Injectable({ providedIn: 'root' })
export class VicImageDownloadService {
  async downloadImage(
    imageConfig: VicJpegImageConfig | VicPngImageConfig | VicSvgImageConfig
  ): Promise<void> {
    const options: SnapdomOptions = {
      fast: true,
      filterMode: 'remove',
      filter: (domNode: Element) => {
        if (getComputedStyle(domNode).display === 'none') {
          return false;
        }

        return imageConfig.filter ? imageConfig.filter(domNode) : true;
      },
      backgroundColor: imageConfig.backgroundColor,
    };

    if (!imageConfig.backgroundColor) {
      delete options.backgroundColor;
    }

    const result = await snapdom(imageConfig.containerNode, options);

    await result.download({
      format: imageConfig.imageType as BlobType,
      filename: imageConfig.fileName,
      quality: imageConfig.quality,
    });
  }
}
