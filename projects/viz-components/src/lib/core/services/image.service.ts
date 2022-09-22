import { Injectable } from '@angular/core';
import * as domToImage from 'html-to-image';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  jpegOptions = {
    quality: 1,
    backgroundColor: '#fff',
  };
  domToImage = domToImage;
  downloadNode(
    containerNode: HTMLElement,
    fileName: string
  ): Promise<string | void> {
    return this.domToImage
      .toJpeg(containerNode, this.jpegOptions)
      .then((dataUrl) => {
        this.createLinkAndClick(dataUrl, fileName);
      });
  }

  createLinkAndClick(dataUrl: string, fileName: string) {
    const link = document.createElement('a');
    link.download = `${fileName}.jpeg`;
    link.href = dataUrl;
    link.click();
  }
}
