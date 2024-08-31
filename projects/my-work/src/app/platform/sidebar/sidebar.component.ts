import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import {
  Casing,
  DirectoryConfigService,
} from '../../core/services/directory-config.service';
import { Section } from '../../core/services/state/state';
import { StateService } from '../../core/services/state/state.service';
import {
  DirectoryComponent,
  DirectoryItem,
  DirectorySelection,
} from '../directory/directory.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectoryComponent, TitleCasePipe],
  providers: [TitleCasePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  Section = Section;
  contentItems$: Observable<{ title: string; items: DirectoryItem[] }>;
  docsItems$: Observable<{ title: string; items: DirectoryItem[] }>;

  constructor(
    public routerState: StateService,

    private configService: DirectoryConfigService
  ) {}

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

  selectDocsItem(item: DirectorySelection): void {
    this.routerState.update({
      section: Section.Docs,
      contentPath: item.activePath,
    });
  }

  selectContentItem(item: DirectorySelection): void {
    this.routerState.update({
      section: Section.Content,
      contentPath: item.activePath,
    });
  }
}
