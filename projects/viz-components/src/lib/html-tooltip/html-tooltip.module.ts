import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HtmlTooltipDirective } from './html-tooltip.directive';

@NgModule({
  declarations: [HtmlTooltipDirective],
  imports: [CommonModule, OverlayModule],
  exports: [HtmlTooltipDirective],
})
export class VzcHtmlTooltipModule {}
