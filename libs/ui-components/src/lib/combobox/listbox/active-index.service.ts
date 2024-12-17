import { DestroyRef, ElementRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  withLatestFrom,
} from 'rxjs';
import {
  AutoComplete,
  ComboboxService,
  OptionAction,
  VisualFocus,
} from '../combobox.service';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';

@Injectable()
export class ActiveIndexService {
  private activeIndex = new BehaviorSubject<number | null>(null);
  activeIndex$ = this.activeIndex.asObservable().pipe(distinctUntilChanged());
  scrollContentRef: ElementRef<HTMLDivElement>;

  constructor(
    private service: ComboboxService,
    private filtering: ListboxFilteringService,
    private scrolling: ListboxScrollService
  ) {}

  init(
    allOptions$: Observable<ListboxOptionComponent[]>,
    destroyRef: DestroyRef
  ): void {
    this.listenToActions(allOptions$, destroyRef);
    this.initActiveId();
    this.setActiveDescendant();
  }

  setScrollContentRef(scrollContentRef: ElementRef): void {
    this.scrollContentRef = scrollContentRef;
  }

  initActiveId(): void {
    if (!this.service.nullActiveIdOnClose) {
      this.activeIndex.next(0);
    }
  }

  listenToActions(
    allOptions$: Observable<ListboxOptionComponent[]>,
    destroyRef: DestroyRef
  ): void {
    this.service.optionAction$
      .pipe(
        takeUntilDestroyed(destroyRef),
        withLatestFrom(this.activeIndex$, allOptions$)
      )
      .subscribe(([action, activeIndex, options]) => {
        if (!this.actionIsTypingChar(action)) {
          if (
            action === OptionAction.last ||
            action === OptionAction.next ||
            action === OptionAction.pageDown
          ) {
            this.setNextActiveIndex(action, activeIndex, options);
          } else if (
            action === OptionAction.first ||
            action === OptionAction.pageUp ||
            action === OptionAction.previous
          ) {
            this.setPrevActiveIndex(action, activeIndex, options);
          } else if (action === OptionAction.zeroActiveIndex) {
            this.setActiveIndex(0, OptionAction.next, options);
          } else if (action === OptionAction.nullActiveIndex) {
            // should only be emitted from editable textboxes
            if (this.service.nullActiveIdOnClose) {
              this.setActiveIndex(null, OptionAction.next, options);
            }
          }
        } else if (action.length === 1) {
          this.updateActiveIndexFromKeyChar(action, options);
        }
      });
  }

  private setNextActiveIndex(
    action: OptionAction,
    activeIndex: number | null,
    options: ListboxOptionComponent[]
  ): void {
    const maxIndex = options.length - 1;
    if (activeIndex === null && action === OptionAction.next) {
      this.setActiveIndex(0, OptionAction.next, options);
    } else {
      this.setActiveIndex(
        this.getIndexForAction(activeIndex, maxIndex, action),
        OptionAction.next,
        options
      );
    }
  }

  private setPrevActiveIndex(
    action: OptionAction,
    activeIndex: number | null,
    options: ListboxOptionComponent[]
  ) {
    const maxIndex = options.length - 1;
    this.setActiveIndex(
      this.getIndexForAction(activeIndex, maxIndex, action),
      OptionAction.previous,
      options
    );
  }

  setActiveIndex(
    index: number | null,
    actionIfDisabled: OptionAction.next | OptionAction.previous | null,
    options: ListboxOptionComponent[],
    scrollToIndex = true
  ): void {
    if (index === this.activeIndex.value) return;
    if (index === null || options.every((x) => x.isDisabled())) {
      this.handleActiveIndexWhenCannotBeSet();
    } else {
      let attempt = index;
      while (actionIfDisabled && options[attempt]?.isDisabled()) {
        if (actionIfDisabled === OptionAction.next) {
          if (attempt === options.length - 1) {
            attempt = 0;
          } else {
            attempt++;
          }
        } else if (actionIfDisabled === OptionAction.previous) {
          if (attempt === 0) {
            attempt = options.length - 1;
          } else {
            attempt--;
          }
        }
      }
      if (
        attempt >= 0 &&
        attempt < options.length &&
        !options[attempt]?.isDisabled()
      ) {
        if (scrollToIndex) {
          this.handleScrollingForNewIndex(attempt, options);
        }
        this.activeIndex.next(attempt);
      } else {
        this.handleActiveIndexWhenCannotBeSet();
      }
    }
  }

  handleActiveIndexWhenCannotBeSet(): void {
    console.log('cannot set active index');
    this.service.setVisualFocus(VisualFocus.textbox);
    if (this.service.autoComplete !== AutoComplete.none) {
      this.activeIndex.next(null);
    }
  }

  private handleScrollingForNewIndex(
    index: number,
    options: ListboxOptionComponent[]
  ): void {
    const indexEl = options[index].label?.nativeElement;
    if (indexEl && this.scrollContentRef.nativeElement) {
      if (this.scrolling.isScrollable(this.scrollContentRef.nativeElement)) {
        this.scrolling.maintainElementVisibility(
          indexEl,
          this.scrollContentRef.nativeElement.parentElement
        );
      }
      if (!this.scrolling.isElementInView(indexEl)) {
        indexEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  private getIndexForAction(
    currentIndex: number | null,
    maxIndex: number,
    action: OptionAction | string
  ): number {
    const pageSize = 10; // used for pageup/pagedown
    const loop = this.service.autoComplete !== AutoComplete.none;
    const validIndex = currentIndex ?? 0;
    const previous = () => {
      if (loop) {
        return validIndex === 0 ? maxIndex : validIndex - 1;
      } else {
        return Math.max(0, validIndex - 1);
      }
    };
    const next = () => {
      if (loop) {
        return validIndex === maxIndex ? 0 : validIndex + 1;
      } else {
        return Math.min(maxIndex, validIndex + 1);
      }
    };

    switch (action) {
      case OptionAction.first:
        return 0;
      case OptionAction.last:
        return maxIndex;
      case OptionAction.previous:
        return previous();
      case OptionAction.next:
        return next();
      case OptionAction.pageUp:
        return Math.max(0, validIndex - pageSize);
      case OptionAction.pageDown:
        return Math.min(maxIndex, validIndex + pageSize);
      default:
        return validIndex;
    }
  }

  actionIsTypingChar(action: OptionAction | string): boolean {
    return !(Object.values(OptionAction) as string[]).includes(action);
  }

  updateActiveIndexFromKeyChar(
    char: string,
    options: ListboxOptionComponent[]
  ): void {
    this.filtering.updateSearchString(char);
    const searchIndex = this.filtering.getIndexByLetter(
      options,
      this.filtering.searchString,
      this.activeIndex.value + 1
    );

    if (searchIndex >= 0) {
      this.setActiveIndex(searchIndex, OptionAction.next, options);
    } else {
      this.filtering.resetSearch();
    }
  }

  private setActiveDescendant(): void {
    const activeDescendant$ = this.activeIndex$.pipe(
      map((i) => {
        if (i === null || i < 0) {
          return null;
        } else {
          return `${this.service.id}-listbox-option-${i}`;
        }
      })
    );
    this.service.initActiveDescendant(activeDescendant$);
  }

  setActiveIndexToFirstSelectedOrDefault(
    options: ListboxOptionComponent[]
  ): void {
    let firstSelected = options.findIndex((x) => x.isSelected());
    if (firstSelected === -1) {
      if (this.service.shouldAutoSelectOnListboxClose) {
        firstSelected = 0;
      } else {
        firstSelected = this.service.nullActiveIdOnClose ? null : 0;
      }
    }
    if (firstSelected > -1) {
      this.setActiveIndex(firstSelected, OptionAction.next, options);
    }
    if (firstSelected === null) {
      this.activeIndex.next(null);
    }
  }
}
