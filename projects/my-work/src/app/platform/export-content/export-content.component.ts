import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ImageDownloadOptions } from 'projects/viz-components/src/lib/image-download/image-download-options';
import {
  VicImageDownloader,
  VicJpegImageConfig,
  VicPngImageConfig,
  VicSvgImageConfig,
} from 'projects/viz-components/src/public-api';

let uniqueId = 0;

type FileType = 'jpeg' | 'png' | 'svg';

@Component({
  selector: 'app-export-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-content.component.html',
  styleUrls: ['./export-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportContentComponent {
  @Input() addTimeStamp = false;
  @Input() fileName: string;
  @Input() fileType: FileType = 'jpeg';
  @Input() height: number;
  @Input() imagePadding = 8;
  @Input() width: number;
  @ViewChild('image') image: ElementRef<HTMLElement>;
  id = uniqueId++;

  constructor(private imageService: VicImageDownloader) {}

  async downloadImage(): Promise<void> {
    const imageConfig = this.getConfig({
      containerNode: this.image.nativeElement,
      fileName: this.getFileName(),
    });
    await this.imageService.downloadImage(imageConfig);
  }

  getConfig(
    options: Partial<ImageDownloadOptions>
  ): VicJpegImageConfig | VicPngImageConfig | VicSvgImageConfig {
    switch (this.fileType) {
      case 'jpeg':
        return new VicJpegImageConfig(options);
      case 'png':
        return new VicPngImageConfig(options);
      case 'svg':
        return new VicSvgImageConfig(options);
    }
  }

  getFileName(): string {
    const base = this.getBaseFileName();
    if (!this.addTimeStamp) {
      return base;
    }
    const date = new Date();
    const timeStamp = this.getTimeStampFromDate(date);
    return `${base}-${timeStamp}`;
  }

  getTimeStampFromDate(date: Date): string {
    return `${date.getFullYear()}${this.prependZero(date.getMonth())}${this.prependZero(date.getDate())}-${this.prependZero(date.getHours())}${this.prependZero(date.getMinutes())}${this.prependZero(date.getSeconds())}`;
  }

  prependZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getBaseFileName(): string {
    return this.fileName || `image-${this.id}`;
  }
}
