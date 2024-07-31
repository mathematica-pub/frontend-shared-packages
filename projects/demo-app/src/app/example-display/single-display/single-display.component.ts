import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, shareReplay, startWith, withLatestFrom } from 'rxjs';
import { RadioInputComponent } from '../../radio-input/radio-input.component';
import { CodeDisplayComponent } from '../code-display/code-display.component';
import { ExampleDisplay } from '../example-display';

@Component({
  selector: 'app-single-display',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioInputComponent,
    CodeDisplayComponent,
  ],
  providers: [FormGroupDirective],
  templateUrl: './single-display.component.html',
  styleUrls: ['../example-display.scss', './single-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SingleDisplayComponent extends ExampleDisplay {
  private destroyRef = inject(DestroyRef);

  initTabs(): void {
    this.setTabList();
    this.setForm();
    this.setSelectedTabIndex();
    this.setTabContent();
    this.setExampleRedrawNudge();
  }

  setTabList(): void {
    this.tabList = [this.label, ...this.fileList.map(this.getFileDisplayName)];
  }

  setForm(): void {
    this.form = new FormGroup({
      selected: new FormControl<number>(0),
    });
  }

  setSelectedTabIndex(): void {
    this.selectedTabIndex$ = this.form.controls.selected.valueChanges.pipe(
      startWith(0)
    );
  }

  setTabContent(): void {
    this.tabContent$ = this.selectedTabIndex$.pipe(
      withLatestFrom(this.filesHtml$),
      map(([index, filesHtml]) => {
        if (index === 0) {
          return null;
        }
        return filesHtml[index - 1];
      }),
      shareReplay(1)
    );
  }

  // Hack to deal with re-rendering projected content
  // Many charts don't need this, but geographies does
  // TODO: ensure that setTimeout is being called in geographies on resize
  setExampleRedrawNudge(): void {
    this.selectedTabIndex$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((index) => {
        if (index === 0) {
          setTimeout(() => {});
        }
      });
  }
}
