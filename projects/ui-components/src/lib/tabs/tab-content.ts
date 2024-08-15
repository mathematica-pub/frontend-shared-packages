import { Directive, InjectionToken, TemplateRef } from '@angular/core';
import { MatTabContent } from '@angular/material/tabs';

export const HSI_UI_TAB_CONTENT = new InjectionToken<MatTabContent>(
  'TabContent'
);

/**
 * Allows a tab to be lazy-loaded when it is activated when used as a directive on an ng-template. It is recommended that this be used when the content of the tab requires calculations.
 */

@Directive({
  selector: '[hsiUiTabContent]',
  providers: [{ provide: HSI_UI_TAB_CONTENT, useExisting: TabContent }],
  standalone: true,
})
export class TabContent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(/** Content for the tab. */ public template: TemplateRef<any>) {}
}
