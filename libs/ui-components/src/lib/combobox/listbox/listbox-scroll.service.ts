import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class ListboxScrollService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  isElementInView(element: HTMLElement): boolean {
    const bounding = element.getBoundingClientRect();

    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <=
        (window.innerHeight || this.document.documentElement.clientHeight) &&
      bounding.right <=
        (window.innerWidth || this.document.documentElement.clientWidth)
    );
  }

  isScrollable(element: HTMLElement): boolean {
    return element && element.parentElement.clientHeight < element.scrollHeight;
  }

  maintainElementVisibility(
    activeElement: HTMLElement,
    scrollParent: HTMLElement
  ): void {
    const { offsetHeight, offsetTop } = activeElement;
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

    if (isAbove) {
      scrollParent.scrollTo(0, offsetTop);
    } else if (isBelow) {
      scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
  }

  scrollToTop(scrollParent: HTMLElement): void {
    scrollParent.scrollTo(0, 0);
  }
}
