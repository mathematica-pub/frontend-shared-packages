import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentDemoComponent } from './component-demo/component-demo.component';

@NgModule({
  declarations: [ComponentDemoComponent],
  exports: [ComponentDemoComponent],
  imports: [CommonModule],
})
export class SharedModule {}
