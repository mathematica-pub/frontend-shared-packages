import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';
import {
  AngularComponentsItem,
  ConfigsService,
  FilesItem,
} from '../../core/services/content-config.service';
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
    private titleCase: TitleCasePipe,
    private configService: ConfigsService
  ) {}

  ngOnInit(): void {
    this.initDirectoryItems();
  }

  initDirectoryItems(): void {
    this.docsItems$ = this.configService.docsConfig$.pipe(
      filter((config) => !!config),
      map((config) => ({
        title: config.title,
        items: this.getDirectoryTree(config.items),
      })),
      tap((config) => console.log(config))
    );

    this.contentItems$ = this.configService.contentConfig$.pipe(
      filter((config) => !!config),
      map((config) => ({
        title: config.title,
        items: this.getDirectoryTree(config.items),
      }))
    );
  }

  getDirectoryTree(
    yaml: FilesItem | AngularComponentsItem,
    level: number = 0
  ): DirectoryItem[] {
    console.log(yaml);
    let itemsArray;
    if (Array.isArray(yaml)) {
      itemsArray = yaml.map((item) => this.createFlatItem(item));
    } else {
      itemsArray = Object.entries(yaml).map(([key, value]) => {
        if (typeof value === 'string') {
          return this.createFlatItem(key);
        } else {
          return {
            name: this.createDisplayName(key),
            value: key,
            children: this.getDirectoryTree(value, level + 1),
          };
        }
      });
    }
    return itemsArray as DirectoryItem[];
  }

  createFlatItem(key: string): DirectoryItem {
    return {
      name: this.createDisplayName(key),
      value: key,
    };
  }

  createDisplayName(str: string): string {
    return this.titleCase.transform(str.replace(/-/g, ' '));
  }

  selectOverview(): void {
    this.routerState.update({ section: Section.Docs });
  }

  selectDocsItem(item: DirectorySelection): void {
    console.log('item', item);
    this.routerState.update({
      section: Section.Docs,
      contentPath: item.activePath,
    });
  }

  selectContentItem(item: DirectorySelection): void {
    console.log('item', item);
    this.routerState.update({
      section: Section.Content,
      contentPath: item.activePath,
    });
  }
}
