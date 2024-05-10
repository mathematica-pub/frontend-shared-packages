import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VicHtmlTooltipDirective } from './html-tooltip.directive';

@NgModule({
  declarations: [VicHtmlTooltipDirective],
  imports: [CommonModule, OverlayModule],
  exports: [VicHtmlTooltipDirective],
})
export class VicHtmlTooltipModule {}
