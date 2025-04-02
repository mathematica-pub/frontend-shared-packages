import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HtmlTooltipDirective } from './html-tooltip.directive';

@NgModule({
  imports: [CommonModule, OverlayModule, HtmlTooltipDirective],
  exports: [HtmlTooltipDirective],
})
export class VicHtmlTooltipModule {}
