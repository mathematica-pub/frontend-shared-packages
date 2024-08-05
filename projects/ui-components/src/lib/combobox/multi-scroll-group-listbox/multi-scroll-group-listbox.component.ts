import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { ListboxComponent } from '../listbox/listbox.component';

@Component({
  standalone: true,
  selector: 'hsi-ui-multi-scroll-group-listbox',
  templateUrl: './multi-scroll-group-listbox.component.html',
  providers: [ListboxFilteringService, ListboxScrollService],
  styleUrls: ['./multi-scroll-group-listbox.component.scss'],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'combobox-listbox-component',
  },
  imports: [CommonModule],
})
export class MultiFiltersListboxComponent<T> extends ListboxComponent<T> {
  /**
   * If the items in listboxGroupsEl are changed dynamically at runtime,
   * this won't work (the array will become out of order; we need the order in handleScrollingForNewIndex);
   * adding code calling `reset` on the QueryList should fix
   */
  @ViewChildren('listboxGroupsEl') listboxGroupsEl: QueryList<ElementRef>;

  override handleScrollingForNewIndex(index: number): void {
    if (this.listboxGroupsEl !== undefined) {
      const indexEl = this.allOptionsArray[index].label?.nativeElement;
      const groupIndex = this.getGroupIndexFromOptionIndex(index);
      const listboxGroupElNativeElementArray = this.listboxGroupsEl.toArray();
      const listboxGroupElNativeElement =
        listboxGroupElNativeElementArray[
          groupIndex
        ].nativeElement.querySelector('.listbox-group');
      if (this.scrolling.isScrollable(listboxGroupElNativeElement)) {
        this.scrolling.maintainScrollVisibility(
          indexEl,
          listboxGroupElNativeElement
        );
      }
      if (!this.scrolling.isElementInView(indexEl)) {
        indexEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else {
      super.handleScrollingForNewIndex(index);
    }
  }

  override resetScroll(): void {
    const groups = this.listboxGroupsEl
      .toArray()
      .map((el) => el.nativeElement.querySelector('.listbox-group'));
    for (const groupEl of groups) {
      if (this.scrolling.isScrollable(groupEl)) {
        this.scrolling.scrollToTop(groupEl);
      }
    }
  }
}
