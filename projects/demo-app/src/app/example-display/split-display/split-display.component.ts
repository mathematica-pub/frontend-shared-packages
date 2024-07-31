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
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { RadioInputComponent } from '../../radio-input/radio-input.component';
import { CodeDisplayComponent } from '../code-display/code-display.component';
import { ExampleDisplay } from '../example-display';

@Component({
  selector: 'app-split-display',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioInputComponent,
    CodeDisplayComponent,
  ],
  providers: [FormGroupDirective],
  templateUrl: './split-display.component.html',
  styleUrls: ['../example-display.scss', './split-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SplitDisplayComponent extends ExampleDisplay implements OnInit {
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
    this.initResizer();
  }

  initTabs(): void {
    this.tabList = [...this.fileList.map(this.getFileDisplayName)];
    this.form = new FormGroup({
      selected: new FormControl<number>(0),
    });
    this.selectedTabIndex$ = this.form.controls.selected.valueChanges.pipe(
      startWith(0)
    );
    this.tabContent$ = combineLatest([
      this.selectedTabIndex$,
      this.filesHtml$,
    ]).pipe(
      map(([index, filesHtml]) => filesHtml[index]),
      shareReplay(1)
    );
  }

  initResizer(): void {
    const mousedown$ = fromEvent<MouseEvent>(
      this.resizer.nativeElement,
      'mousedown'
    );
    const mousemove$ = fromEvent<MouseEvent>(this.document, 'mousemove');
    const mouseup$ = fromEvent<MouseEvent>(this.document, 'mouseup');

    this.exampleWidth$ = mousedown$.pipe(
      switchMap((startEvent) => {
        const startX = startEvent.clientX;
        const startWidth = this.examplePanel.nativeElement.offsetWidth;

        return mousemove$.pipe(
          map((moveEvent) => {
            const dx = moveEvent.clientX - startX;
            return `${startWidth + dx}px`;
          }),
          takeUntil(mouseup$)
        );
      })
    );
    startWith('500px');
  }
}
