import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from '@hsi/ui-components';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  shareReplay,
} from 'rxjs';
import { CodeDisplayComponent } from '../code-display/code-display.component';
import { ResizableExampleDisplay } from './resizable-example-display';

@Component({
  selector: 'app-split-panel-example-display',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CodeDisplayComponent,
    TabsModule,
  ],
  providers: [FormGroupDirective],
  templateUrl: './split-panel-example-display.component.html',
  styleUrls: [
    '../example-display/example-display.scss',
    './split-panel-example-display.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SplitPanelExampleDisplayComponent
  extends ResizableExampleDisplay
  implements OnInit
{
  @ViewChild('resizer', { static: true }) resizer: ElementRef<HTMLDivElement>;
  @ViewChild('examplePanel', { static: true })
  examplePanel: ElementRef<HTMLDivElement>;
  exampleWidth: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  exampleWidth$: Observable<string>;

  constructor(@Inject(DOCUMENT) private document: Document) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.initResizer(
      this.resizer.nativeElement,
      this.examplePanel.nativeElement,
      this.document
    );
  }

  initTabs(): void {
    this.tabList = [...this.fileList.map(this.getFileDisplayName)];
    this.tabContent$ = combineLatest([
      this.selectedTabIndex$,
      this.filesHtml$,
    ]).pipe(
      map(([index, filesHtml]) => filesHtml[index]),
      shareReplay(1)
    );
  }
}
