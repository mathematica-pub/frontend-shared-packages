import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsModule } from '@hsi/ui-components';
import { combineLatest, map, shareReplay } from 'rxjs';
import { CodeDisplayComponent } from '../code-display/code-display.component';
import { ExampleDisplay } from '../example-display/example-display';

@Component({
  selector: 'app-single-panel-example-display',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CodeDisplayComponent,
    TabsModule,
    MatTabsModule,
  ],
  providers: [FormGroupDirective],
  templateUrl: './single-panel-example-display.component.html',
  styleUrls: [
    '../example-display/example-display.scss',
    './single-panel-example-display.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SinglePanelExampleDisplayComponent extends ExampleDisplay {
  initTabs(): void {
    this.setTabList();
    this.setTabContent();
  }

  setTabList(): void {
    this.tabList = [this.label, ...this.fileList.map(this.getFileDisplayName)];
  }

  setTabContent(): void {
    this.tabContent$ = combineLatest([
      this.selectedTabIndex$,
      this.filesHtml$,
    ]).pipe(
      map(([index, filesHtml]) => {
        if (index === 0) {
          return null;
        }
        return filesHtml[index - 1];
      }),
      shareReplay(1)
    );
  }
}
