import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { getContentConfigForLib } from '../../../core/constants/file-paths.constants';
import { AssetsService } from '../../../core/services/assets.service';
import { Library } from '../../../core/services/router-state/state';
import { ManualDocumentationConfig } from '../../viz-components/config';

@Injectable({
  providedIn: 'root',
})
export class ContentConfigService {
  configs: Record<Library, ManualDocumentationConfig> = {
    [Library.VizComponents]: {} as ManualDocumentationConfig,
    [Library.UiComponents]: {} as ManualDocumentationConfig,
    [Library.SharedPackages]: {} as ManualDocumentationConfig,
  };

  constructor(private assets: AssetsService) {}

  initConfigs(libs: Library[]): void {
    forkJoin(
      libs.map((lib) =>
        this.assets.getAsset<ManualDocumentationConfig>(
          getContentConfigForLib(lib),
          'yaml'
        )
      )
    ).subscribe((configs) => {
      (configs as ManualDocumentationConfig[]).forEach(
        (config: ManualDocumentationConfig, index: number) => {
          this.configs[libs[index]] = config;
        }
      );
    });
  }
}
