import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentDemoComponent } from './component-demo/component-demo.component';
import { ComponentDocumentationComponent } from './component-documentation/component-documentation.component';
import { RadioInputComponent } from './radio-input/radio-input.component';
import { RenderFileComponent } from './render-file/render-file.component';

@NgModule({
  declarations: [
    ComponentDemoComponent,
    ComponentDocumentationComponent,
    RenderFileComponent,
    RadioInputComponent,
  ],
  exports: [ComponentDemoComponent, ComponentDocumentationComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class SharedModule {}
