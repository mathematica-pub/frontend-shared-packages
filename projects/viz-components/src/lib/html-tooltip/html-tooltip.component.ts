import { Component, Input } from '@angular/core';

@Component({
  selector: 'vzc-html-tooltip',
  templateUrl: './html-tooltip.component.html',
  styleUrls: ['./html-tooltip.component.scss'],
})
export class HtmlTooltipComponent {
  @Input() bottom: number;
  @Input() left: number;

  getLeftOffset(contentWidth: number): number {
    return this.left - contentWidth / 2;
  }
}
