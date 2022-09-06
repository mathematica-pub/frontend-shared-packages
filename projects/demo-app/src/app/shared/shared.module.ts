import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentDemoComponent } from './component-demo/component-demo.component';
import { ComponentDocumentationComponent } from './component-documentation/component-documentation.component';
import { RenderFileComponent } from './render-file/render-file.component';

@NgModule({
  declarations: [ComponentDemoComponent, ComponentDocumentationComponent, RenderFileComponent],
  exports: [ComponentDemoComponent, ComponentDocumentationComponent],
  imports: [CommonModule],
})
export class SharedModule {}
