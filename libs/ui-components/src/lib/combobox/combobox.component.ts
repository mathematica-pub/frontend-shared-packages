import { Platform } from '@angular/cdk/platform';
import { AsyncPipe, CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, merge, withLatestFrom } from 'rxjs';
import { ComboboxLabelComponent } from './combobox-label/combobox-label.component';
import { ComboboxService, FocusTextbox } from './combobox.service';

@Component({
  selector: 'hsi-ui-combobox',
  imports: [CommonModule, AsyncPipe],
  providers: [ComboboxService],
  templateUrl: './combobox.component.html',
  styleUrls: ['./styles/styles.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hsi-ui-combobox' },
})
export class ComboboxComponent implements OnInit, OnDestroy {
  @ContentChild(ComboboxLabelComponent) labelComponent: ComboboxLabelComponent;

  constructor(
    public service: ComboboxService,
    public platform: Platform,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document,
    private elRef: ElementRef,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.handleOutsideClick();
  }

  ngOnDestroy(): void {
    this.service.destroy();
  }

  handleOutsideClick(): void {
    if (!this.document) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      merge(
        fromEvent(this.document, 'touchstart', { capture: true }),
        fromEvent(this.document, 'mousedown', { capture: true })
      )
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          withLatestFrom(this.service.isOpen$),
          filter(
            ([event, isOpen]) =>
              isOpen && !event.composedPath().includes(this.elRef.nativeElement)
          )
        )
        .subscribe(() => {
          if (this.platform.IOS || this.platform.ANDROID) {
            this.service.emitTextboxFocus(FocusTextbox.includeMobile);
          }
          this.service.emitTextboxBlur();
        });
    });
  }
}
