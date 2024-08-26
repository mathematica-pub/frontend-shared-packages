import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { FileResource } from '../resources/file.resource';

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

export type FilesItem = string | FilesConfig;

export interface AngularComponentsConfig {
  [key: string]: AngularComponentsItem;
}

export type AngularComponentsItem = string[] | AngularComponentsConfig;

@Injectable({
  providedIn: 'root',
})
export class ConfigsService {
  basePath = '/assets/';
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

  constructor(private files: FileResource) {}

  initConfigs(): void {
    forkJoin([
      this.files.getYamlFile(this.basePath + this.docsPath),
      this.files.getYamlFile(this.basePath + this.contentPath),
    ]).subscribe((configs: [DocsConfig, ContentConfig]) => {
      this._docsConfig.next(configs[0]);
      this._contentConfig.next(configs[1]);
    });
  }
}
