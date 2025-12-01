import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  Output,
  QueryList,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map, startWith } from 'rxjs';
import { TabItemComponent } from './tab-item.component';
import { TabsService } from './tabs.service';

@Component({
  selector: 'hsi-ui-tabs',
  imports: [CommonModule],
  providers: [TabsService],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent<T> implements AfterContentInit {
  @ContentChildren(TabItemComponent) tabs: QueryList<TabItemComponent<T>>;
  @Output() tabChange = new EventEmitter<T | string>();
  tabItems$: Observable<TabItemComponent<T>[]>;
  tabChanges$: Observable<boolean[]>;

  constructor(
    public service: TabsService<T>,
    private destroyRef: DestroyRef
  ) {}

  ngAfterContentInit(): void {
    this.tabItems$ = this.tabs.changes.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(''),
      map(() => this.tabs.toArray())
    );
    this.initializeActiveTab();
  }

  initializeActiveTab(): void {
    if (!this.service.activeTab.value) {
      this.service.activeTab.next(this.tabs.first);
    }
  }

  selectTab(tabItem: TabItemComponent<T>): void {
    if (this.service.activeTab.value !== tabItem) {
      this.service.activeTab.next(tabItem);
      this.emitNewActiveTab(tabItem);
    }
  }

  emitNewActiveTab(tabItem: TabItemComponent<T>): void {
    const value =
      tabItem.value ??
      tabItem.labelComponent.labelElement.nativeElement.innerText;
    this.tabChange.emit(value);
  }

  handleKeydown(event: KeyboardEvent, tabItem: TabItemComponent<T>): void {
    const tabIndex = this.tabs.toArray().indexOf(tabItem);
    let cancelOtherActions = false;

    switch (event.key) {
      case 'Enter':
      case ' ':
        this.selectTab(tabItem);
        cancelOtherActions = true;
        break;

      case 'ArrowRight':
      case 'Right':
        this.focusNextTab(tabIndex);
        cancelOtherActions = true;
        break;

      case 'ArrowLeft':
      case 'Left':
        this.focusPreviousTab(tabIndex);
        cancelOtherActions = true;
        break;

      case 'Home':
        this.focusTab(this.tabs.first);
        cancelOtherActions = true;
        break;

      case 'End':
        this.focusTab(this.tabs.last);
        cancelOtherActions = true;
        break;

      default:
        break;
    }

    if (cancelOtherActions) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  focusTab(tabItem: TabItemComponent<T>): void {
    tabItem.labelComponent.labelElement.nativeElement.parentElement?.focus();
  }

  focusNextTab(tabIndex: number): void {
    if (tabIndex < this.tabs.length - 1) {
      this.focusTab(this.tabs.toArray()[tabIndex + 1]);
    } else {
      this.focusTab(this.tabs.first);
    }
  }

  focusPreviousTab(tabIndex: number): void {
    if (tabIndex > 0) {
      this.focusTab(this.tabs.toArray()[tabIndex - 1]);
    } else {
      this.focusTab(this.tabs.last);
    }
  }
}
