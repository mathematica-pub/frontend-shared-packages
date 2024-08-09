import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabBodyComponent } from './tab-body.component';
import { TabContent } from './tab-content';
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
    TabContent,
  ],
  exports: [
    TabsComponent,
    TabLabelComponent,
    TabItemComponent,
    TabBodyComponent,
    TabContent,
  ],
})
export class TabsModule {}
