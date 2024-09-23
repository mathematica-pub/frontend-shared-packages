import { Injectable } from '@angular/core';
import { AdkAssetResponseType, AdkAssetsService } from '@hsi/app-dev-kit';
import { BehaviorSubject, map } from 'rxjs';
import { parse as yamlParse } from 'yaml';
import { Library } from './router-state/state';

export type SidebarConfig = Record<Library, LibConfig>;

export interface LibConfig {
  title: string;
  overview: string;
  content: ContentConfig;
}

export interface ContentConfig {
  title: string;
  items: Record<string, string>;
}

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
      .getAsset('content.yaml', AdkAssetResponseType.Text)
      .pipe(map((raw) => yamlParse(raw as string) as SidebarConfig))
      .subscribe((config) => {
        console.log('Config loaded:', config);
        this.config.next(config);
      });
  }

  getConfig(lib: Library): LibConfig {
    return this.config.value[lib];
  }
}
