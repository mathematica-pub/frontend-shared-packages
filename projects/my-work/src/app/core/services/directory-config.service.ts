import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { DirectoryItem } from 'projects/ui-components/src/public-api';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { AssetsService } from '../services/assets.service';

export interface ContentConfig {
  title: string;
  items: string[] | AngularComponentsConfig;
}

export interface DocsConfig {
  title: string;
  items: FilesConfig;
}

export interface FilesConfig {
  [key: string]: FilesItem;
}

export type FilesItem = string | null | FilesConfig;

export interface AngularComponentsConfig {
  [key: string]: AngularComponentsItem;
}

export type AngularComponentsItem = string[] | AngularComponentsConfig;

export enum Casing {
  Lower = 'lower',
  Sentence = 'sentence',
  Title = 'title',
}

@Injectable({
  providedIn: 'root',
  deps: [TitleCasePipe],
})
export class DirectoryConfigService {
  contentPath = 'content/content.yaml';
  docsPath = 'documentation/documentation.yaml';
  private _contentConfig: BehaviorSubject<ContentConfig> = new BehaviorSubject(
    null
  );
  contentConfig$ = this._contentConfig.asObservable();
  private _docsConfig: BehaviorSubject<DocsConfig> = new BehaviorSubject(null);
  docsConfig$ = this._docsConfig.asObservable();

  get contentConfig(): ContentConfig {
    return this._contentConfig.value;
  }

  get docsConfig(): DocsConfig {
    return this._docsConfig.value;
  }

  constructor(
    private assets: AssetsService,
    private titleCase: TitleCasePipe
  ) {}

  initConfigs(): void {
    forkJoin([
      this.assets.getYamlFile<DocsConfig>(this.docsPath),
      this.assets.getYamlFile<ContentConfig>(this.contentPath),
    ]).subscribe((configs: [DocsConfig, ContentConfig]) => {
      this._docsConfig.next(configs[0]);
      this._contentConfig.next(configs[1]);
    });
  }

  getDirectoryTree(
    yaml: FilesItem | AngularComponentsItem,
    level: number = 0,
    itemCasing: Casing = Casing.Title
  ): DirectoryItem[] {
    let itemsArray;
    if (yaml === undefined) {
      return [];
    }
    if (Array.isArray(yaml)) {
      itemsArray = yaml.map((item) => this.createFlatItem(item, itemCasing));
    } else {
      itemsArray = Object.entries(yaml).map(([key, value]) => {
        if (typeof value === 'string' || value === null) {
          return this.createFlatItem(key, itemCasing);
        } else {
          return {
            name: this.getDisplayName(key, itemCasing),
            value: key,
            children: this.getDirectoryTree(value, level + 1),
          };
        }
      });
    }
    return itemsArray as DirectoryItem[];
  }

  createFlatItem(key: string, itemCasing: Casing): DirectoryItem {
    return {
      name: this.getDisplayName(key, itemCasing),
      value: key,
    };
  }

  getDisplayName(str: string, itemCasing: Casing): string {
    const dehyphenated = str.replace(/-/g, ' ');
    switch (itemCasing) {
      case Casing.Lower:
        return dehyphenated.toLowerCase();
      case Casing.Sentence:
        return dehyphenated.charAt(0).toUpperCase() + dehyphenated.slice(1);
      case Casing.Title:
        return this.titleCase.transform(dehyphenated);
    }
  }
}
