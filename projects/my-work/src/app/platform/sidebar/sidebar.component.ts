import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';
import { ContentConfigService } from '../../core/services/content-config.service';
import { RouterStateService } from '../../core/services/router-state/router-state.service';
import { Section } from '../../core/services/router-state/state';
import {
  DirectoryComponent,
  DirectoryItem,
  DirectorySelection,
} from '../directory/directory.component';

type NestedStringObject = {
  [key: string]: string | string[] | NestedStringObject;
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectoryComponent, TitleCasePipe],
  providers: [TitleCasePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  Section = Section;
  directoryItems$: Observable<{ title: string; items: DirectoryItem[] }>;

  constructor(
    public routerState: RouterStateService,
    private titleCase: TitleCasePipe,
    private configService: ContentConfigService
  ) {}

  ngOnInit(): void {
    this.initDirectoryItems();
  }

  initDirectoryItems(): void {
    this.directoryItems$ = this.configService.config$.pipe(
      filter((config) => !!config),
      tap((config) => console.log(config)),
      map((config) => ({
        title: config.title,
        items: this.getDocsDirectoryTree(config.items),
      }))
    );
  }

  getDocsDirectoryTree(
    yaml: string[] | NestedStringObject,
    level: number = 0
  ): DirectoryItem[] {
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
            children: this.getDocsDirectoryTree(value, level + 1),
          };
        }
      });
    }
    // Documentation structure doc determines the order for the top level
    if (level !== 0) {
      itemsArray.sort((a, b) => {
        if (!a.children && !!b.children) return 1;
        if (!!a.children && !b.children) return -1;
        return a.name.localeCompare(b.name);
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
    this.routerState.update({ section: Section.Overview });
  }

  selectItem(item: DirectorySelection): void {
    this.routerState.update({
      section: Section.Content,
      contentPath: item.activePath,
    });
  }
}
