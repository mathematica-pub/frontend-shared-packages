import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { TabContentDirective } from './tab-content';

@Component({
  selector: 'hsi-ui-tab-body',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  standalone: true,
})
export class TabBodyComponent {
  @ViewChild(TemplateRef)
  bodyContent: TemplateRef<HTMLElement>;
  @ContentChild(TabContentDirective, { read: TemplateRef, static: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lazyLoadedContent: TemplateRef<any>;
}
