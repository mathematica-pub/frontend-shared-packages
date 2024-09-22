import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { getContentConfigForLib } from '../core/constants/file-paths.constants';
import { AssetsService } from '../core/services/assets.service';
import { Library } from '../core/services/router-state/state';
import { ContentConfig } from './viz-components/config';

@Injectable({
  providedIn: 'root',
})
export class ContentConfigService {
  configs: Record<Library, ContentConfig> = {
    [Library.VizComponents]: {} as ContentConfig,
    [Library.UiComponents]: {} as ContentConfig,
    [Library.SharedPackages]: {} as ContentConfig,
  };

  constructor(private assets: AssetsService) {}

  initConfigs(libs: Library[]): void {
    forkJoin(
      libs.map((lib) =>
        this.assets.getAsset<ContentConfig>(getContentConfigForLib(lib), 'yaml')
      )
    ).subscribe((configs) => {
      (configs as ContentConfig[]).forEach(
        (config: ContentConfig, index: number) => {
          this.configs[libs[index]] = config;
        }
      );
    });
  }
}
