import { Injectable } from '@angular/core';
import { AdkAssetResponse, AdkAssetsService } from '@hsi/app-dev-kit';
import { BehaviorSubject, map } from 'rxjs';
import { Library } from './router-state/state';

export type SidebarConfig = Record<Library, DocsConfig>;

export interface LibConfig {
  title: string;
  overview: string;
  content: ContentConfig;
}

export interface ContentConfig {
  title: string;
  items: Record<string, string>;
}

export interface DocsConfig {
  title: string;
  items: FilesConfig;
}

export interface FilesConfig {
  [key: string]: FilesItem;
}

export type FilesItem = string | null | FilesConfig;

@Injectable({
  providedIn: 'root',
})
export class ContentConfigService {
  config: BehaviorSubject<SidebarConfig> = new BehaviorSubject<SidebarConfig>(
    null
  );
  config$ = this.config.asObservable();

  constructor(private assets: AdkAssetsService) {}

  initConfig(): void {
    this.assets
      .getAsset('content.yaml', AdkAssetResponse.Text)
      .pipe(map((raw) => this.assets.parseYaml(raw as string) as SidebarConfig))
      .subscribe((config) => {
        this.config.next(config);
      });
  }

  getConfig(lib: Library): DocsConfig {
    return this.config.value[lib];
  }
}
