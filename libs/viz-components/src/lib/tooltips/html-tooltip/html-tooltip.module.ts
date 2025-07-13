import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HtmlTooltipDirective } from './html-tooltip.directive';
import { TooltipTriangleComponent } from './tooltip-triangle/tooltip-triangle.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    HtmlTooltipDirective,
    TooltipTriangleComponent,
  ],
  exports: [HtmlTooltipDirective, TooltipTriangleComponent],
})
export class VicHtmlTooltipModule {}
