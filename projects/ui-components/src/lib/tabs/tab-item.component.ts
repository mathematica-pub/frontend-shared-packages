import { Component, ContentChild, Input, OnChanges } from '@angular/core';
import { TabBodyComponent } from './tab-body.component';
import { TabLabelComponent } from './tab-label.component';
import { TabsService } from './tabs.service';

@Component({
  selector: 'hsi-ui-tab-item',
  template: '<ng-content></ng-content>',
  standalone: true,
})
export class TabItemComponent<T> implements OnChanges {
  @Input() isActive = false;
  @Input() value: T;
  @ContentChild(TabBodyComponent) bodyComponent: TabBodyComponent;
  @ContentChild(TabLabelComponent) labelComponent: TabLabelComponent;

  constructor(private service: TabsService<T>) {}

  ngOnChanges(): void {
    if (this.isActive) {
      this.service.activeTab.next(this);
    }
  }
}
