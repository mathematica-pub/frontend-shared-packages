import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssetsService } from './assets.service';
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

  constructor(private assets: AssetsService) {}

  initConfig(): void {
    this.assets
      .getAsset<SidebarConfig>('content.yaml', 'yaml')
      .subscribe((config) => {
        console.log('Config loaded:', config);
        this.config.next(config);
      });
  }

  getConfig(lib: Library): LibConfig {
    return this.config.value[lib];
  }
}
