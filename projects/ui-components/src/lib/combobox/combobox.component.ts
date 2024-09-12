import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, merge } from 'rxjs';
import { ComboboxLabelComponent } from './combobox-label/combobox-label.component';
import { ComboboxService } from './combobox.service';

@Component({
  selector: 'hsi-ui-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss'],
  providers: [ComboboxService],
  encapsulation: ViewEncapsulation.None,
})
export class ComboboxComponent implements OnInit, AfterViewInit {
  @ViewChild('comboboxComponent') comboboxElRef: ElementRef;
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

  ngAfterViewInit(): void {
    this.service.setComboboxElRef(this.comboboxElRef);
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
          filter(
            (event) => !event.composedPath().includes(this.elRef.nativeElement)
          )
        )
        .subscribe(() => {
          this.service.emitBlurEvent();
        });
    });
  }
}
