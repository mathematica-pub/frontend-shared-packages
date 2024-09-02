import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FileResource } from '../../../core/resources/file.resource';
import { Library } from '../../../core/services/router-state/state';
import { ContentConfig } from '../../viz-components/config';

@Injectable({
  providedIn: 'root',
})
export class ContentConfigService {
  basePath: string = '/assets';
  fileName: string = '/content/content.yaml';
  configs: Record<Library, ContentConfig> = {
    [Library.VizComponents]: {} as ContentConfig,
    [Library.UiComponents]: {} as ContentConfig,
    [Library.SharedPackages]: {} as ContentConfig,
  };

  constructor(private files: FileResource) {}

  initConfigs(libs: Library[]): void {
    forkJoin(
      libs.map((lib) =>
        this.files.getYamlFile(this.basePath + '/' + lib + this.fileName)
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
