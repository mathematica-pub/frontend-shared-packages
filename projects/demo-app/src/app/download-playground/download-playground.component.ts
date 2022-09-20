import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Sanitizer,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as d3 from 'd3';

@Component({
  selector: 'app-download-playground',
  templateUrl: './download-playground.component.html',
  styleUrls: ['./download-playground.component.scss'],
})
export class DownloadPlaygroundComponent implements AfterViewInit {
  @ViewChild('visualization') vizDiv: ElementRef<HTMLDivElement>;
  png: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    const svg = d3
      .select(this.vizDiv.nativeElement)
      .append('svg')
      .attr('id', 'mysvg')
      .attr('width', 400)
      .attr('height', 400);
    svg
      .append('rect')
      .attr('width', '100%')
      .attr('height', '50%')
      .attr('fill', 'yellow');
    this.setupPng();
  }

  downloadSvg(): void {
    return;
  }

  createSvgBlob(element: ElementRef): void {
    // do stuff
    return;
  }

  setupPng(): void {
    const visualization: any = document.getElementById('mysvg');
    const outerHTML = visualization.outerHTML;
    const blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'myfile.svg';
    link.click();

    // const image = new Image();
    // image.onload = () => {
    //   const canvas = document.createElement('canvas');
    //   canvas.width = width;
    //   canvas.height = height;
    //   const context = canvas.getContext('2d');
    //   context.drawImage(image, 0, 0, width, height);

    //   const png = canvas.toDataURL();
    //   const download = function (href, name) {
    //     const link = document.createElement('a');
    //     link.download = name;
    //     link.style.opacity = '0';
    //     document.body.append(link);
    //     link.href = href;
    //     link.click();
    //     link.remove();
    //   };
    //   download(png, 'image.png');
    // };
    // image.onerror = () => {
    //   alert('a problem has occurred');
    // };
    // image.src = blobURL;
  }
}
