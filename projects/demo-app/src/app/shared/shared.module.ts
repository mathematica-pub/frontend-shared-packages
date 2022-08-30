import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentDemoComponent } from './component-demo/component-demo.component';
import { ComponentDocumentationComponent } from './component-documentation/component-documentation.component';

@NgModule({
  declarations: [ComponentDemoComponent, ComponentDocumentationComponent],
  exports: [ComponentDemoComponent, ComponentDocumentationComponent],
  imports: [CommonModule],
})
export class SharedModule {}
