import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { AdkDocumentationNavigationSiblings } from '../documentation-config-parser';

@Component({
  selector: 'hsi-adk-navigation-siblings',
  imports: [CommonModule],
  providers: [TitleCasePipe],
  templateUrl: './navigation-siblings.component.html',
  styleUrls: ['./navigation-siblings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSiblingsComponent implements OnChanges {
  @Input() siblings: AdkDocumentationNavigationSiblings;
  @Output() nextDoc: EventEmitter<string> = new EventEmitter<string>();
  previous: string;
  next: string;

  constructor(private titleCase: TitleCasePipe) {}

  ngOnChanges(): void {
    this.setDisplayNames();
  }

  setDisplayNames(): void {
    this.previous = this.siblings.previous
      ? this.getDisplayName(this.siblings.previous)
      : undefined;
    this.next = this.siblings.next
      ? this.getDisplayName(this.siblings.next)
      : undefined;
  }

  getDisplayName(path: string): string {
    const paths = path.split('/');
    const end = paths[paths.length - 1];
    const dehyphenated = end.replace(/-/g, ' ');
    return this.titleCase.transform(dehyphenated);
  }

  navigateToDoc(sibling: string): void {
    this.nextDoc.emit(sibling);
  }
}
