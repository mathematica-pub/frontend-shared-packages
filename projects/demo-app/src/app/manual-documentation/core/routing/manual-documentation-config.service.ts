import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FileResource } from '../../../core/resources/file.resource';
import { Library } from '../../../core/services/router-state/state';
import { ManualDocumentationConfig } from '../../viz-components/config';

@Injectable({
  providedIn: 'root',
})
export class ManualDocumentationConfigService {
  basePath: string = '/app/manual-documentation/';
  fileName: string = 'config.yaml';
  configs: Record<Library, ManualDocumentationConfig> = {
    [Library.VizComponents]: {} as ManualDocumentationConfig,
    [Library.UiComponents]: {} as ManualDocumentationConfig,
    [Library.SharedPackages]: {} as ManualDocumentationConfig,
  };

  constructor(private files: FileResource) {}

  initConfigs(libs: Library[]): void {
    forkJoin(
      libs.map((lib) =>
        this.files.getYamlFile(this.basePath + lib + '/' + this.fileName)
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
