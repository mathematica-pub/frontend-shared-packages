import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  VicImage,
  VicImageDownloadConfig,
  VicImageDownloader,
  VicJpegImageConfig,
  VicPngImageConfig,
  VicSvgImageConfig,
} from 'projects/viz-components/src/public-api';

let uniqueId = 0;

@Component({
  selector: 'app-export-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-content.component.html',
  styleUrls: ['./export-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportContentComponent {
  @Input() fileType: VicImage = VicImage.jpeg;
  @Input() fileName: string;
  @Input() addTimeStamp = false;
  @Input() width: number;
  @Input() height: number;
  @Input() padImage = true;
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
    options: Partial<VicImageDownloadConfig>
  ): VicJpegImageConfig | VicPngImageConfig | VicSvgImageConfig {
    switch (this.fileType) {
      case VicImage.jpeg:
        return new VicJpegImageConfig(options);
      case VicImage.png:
        return new VicPngImageConfig(options);
      case VicImage.svg:
        return new VicSvgImageConfig(options);
    }
  }

  getFileName(): string {
    const base = this.getBaseFileName();
    if (!this.addTimeStamp) {
      return base;
    }
    const date = new Date();
    const timeStamp = `${date.getFullYear()}${this.prependZero(date.getMonth())}${this.prependZero(date.getDate())}-${this.prependZero(date.getHours())}${this.prependZero(date.getMinutes())}${this.prependZero(date.getSeconds())}`;
    return `${base}-${timeStamp}`;
  }

  prependZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getBaseFileName(): string {
    return this.fileName || `image-${this.id}`;
  }
}
