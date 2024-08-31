import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import {
  Casing,
  DirectoryConfigService,
} from '../../../core/services/directory-config.service';
import { Section } from '../../../core/services/state/state';
import { StateService } from '../../../core/services/state/state.service';
import { NavigationSiblings } from '../documentation.service';

@Component({
  selector: 'app-navigation-siblings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-siblings.component.html',
  styleUrls: ['./navigation-siblings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSiblingsComponent implements OnChanges {
  @Input() siblings: NavigationSiblings;
  previous: string;
  next: string;

  constructor(
    private routerState: StateService,
    public configService: DirectoryConfigService
  ) {}

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
    return this.configService.getDisplayName(
      paths[paths.length - 1],
      Casing.Title
    );
  }

  goToSibling(sibling: string): void {
    this.routerState.update({ section: Section.Docs, contentPath: sibling });
  }
}
