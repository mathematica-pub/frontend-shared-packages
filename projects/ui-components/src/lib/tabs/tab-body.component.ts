import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'hsi-ui-tab-body',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  standalone: true,
})
export class TabBodyComponent {
  @ViewChild(TemplateRef)
  bodyContent: TemplateRef<HTMLElement>;
}
