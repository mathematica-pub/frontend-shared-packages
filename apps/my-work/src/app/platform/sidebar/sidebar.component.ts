import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  HsiUiDirectoryComponent,
  HsiUiDirectoryItem,
  HsiUiDirectorySelection,
} from '@mathstack/ui';
import { filter, map, Observable } from 'rxjs';
import {
  Casing,
  DirectoryConfigsService,
} from '../../core/services/directory-config.service';
import { RouterStateService } from '../../core/services/router-state/router-state.service';
import { Section } from '../../core/services/router-state/state';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, HsiUiDirectoryComponent],
  providers: [TitleCasePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  Section = Section;
  contentItems$: Observable<{ title: string; items: HsiUiDirectoryItem[] }>;
  docsItems$: Observable<{ title: string; items: HsiUiDirectoryItem[] }>;

  constructor(
    public routerState: RouterStateService,

    private configService: DirectoryConfigsService
  ) { }

  ngOnInit(): void {
    this.initDirectoryItems();
  }

  initDirectoryItems(): void {
    this.docsItems$ = this.configService.docsConfig$.pipe(
      filter((config) => !!config),
      map((config) => ({
        title: config.title,
        items: this.configService.getDirectoryTree(
          config.items,
          0,
          Casing.Sentence
        ),
      }))
    );

    this.contentItems$ = this.configService.contentConfig$.pipe(
      filter((config) => !!config),
      map((config) => ({
        title: config.title,
        items: this.configService.getDirectoryTree(config.items),
      }))
    );
  }

  selectOverview(): void {
    this.routerState.update({ section: Section.Docs });
  }

  selectDocsItem(item: HsiUiDirectorySelection): void {
    this.routerState.update({
      section: Section.Docs,
      contentPath: item.activePath,
    });
  }

  selectContentItem(item: HsiUiDirectorySelection): void {
    this.routerState.update({
      section: Section.Content,
      contentPath: item.activePath,
    });
  }
}
