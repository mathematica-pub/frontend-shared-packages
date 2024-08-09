import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabBodyComponent } from './tab-body.component';
import { TabContentDirective } from './tab-content.directive';
import { TabItemComponent } from './tab-item.component';
import { TabLabelComponent } from './tab-label.component';
import { TabsComponent } from './tabs.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TabsComponent,
    TabLabelComponent,
    TabItemComponent,
    TabBodyComponent,
    TabContentDirective,
  ],
  exports: [
    TabsComponent,
    TabLabelComponent,
    TabItemComponent,
    TabBodyComponent,
    TabContentDirective,
  ],
})
export class TabsModule {}
