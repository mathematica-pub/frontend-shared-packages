import {
  Component,
  ContentChild,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TabContentDirective } from './tab-content.directive';

@Component({
  selector: 'hsi-ui-tab-body',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-template><ng-content></ng-content></ng-template>',
})
export class TabBodyComponent {
  @ViewChild(TemplateRef)
  bodyContent: TemplateRef<HTMLElement>;
  @ContentChild(TabContentDirective, { read: TemplateRef, static: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lazyLoadedContent: TemplateRef<any>;
}
