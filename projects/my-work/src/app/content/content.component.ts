import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  VicImageDownloader,
  VicJpegImageConfig,
} from 'projects/viz-components/src/public-api';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent {
  @ViewChild('imageContainer') imageContainer: ElementRef<HTMLElement>;

  constructor(private imageService: VicImageDownloader) {}

  async downloadImage(): Promise<void> {
    const imageConfig = new VicJpegImageConfig({
      containerNode: this.imageContainer.nativeElement,
      fileName: 'testfile',
    });
    await this.imageService.downloadImage(imageConfig);
  }
}
