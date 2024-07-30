import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, shareReplay, startWith, withLatestFrom } from 'rxjs';
import { RadioInputComponent } from '../../radio-input/radio-input.component';
import { CodeDisplayComponent } from '../code-display/code-display.component';
import { Example } from '../example';

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
  styleUrl: './split-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SplitDisplayComponent extends Example implements AfterViewInit {
  @ViewChild('slider') slider: ElementRef<HTMLDivElement>;
  private destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {}

  initTabs(): void {
    this.tabList = [...this.fileList.map(this.getFileDisplayName)];
    this.form = new FormGroup({
      selected: new FormControl<number>(0),
    });
    this.selectedTabIndex$ = this.form.controls.selected.valueChanges.pipe(
      startWith(0)
    );
  }

  initTabContent(): void {
    this.tabContent$ = this.selectedTabIndex$.pipe(
      withLatestFrom(this.filesHtml$),
      map(([index, filesHtml]) => filesHtml[index]),
      shareReplay(1)
    );
  }
}
