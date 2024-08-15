import { Injectable } from '@angular/core';
import { FileResource } from 'projects/demo-app/src/app/core/resources/file.resource';
import { ManualDocumentationConfig } from 'projects/demo-app/src/app/manual-documentation/viz-components/config';
import { Library } from 'projects/demo-app/src/app/sidebar/lib-docs/libraries';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DirectoryConfigService {
  basePath: string = '/app/manual-documentation/';
  fileName: string = 'config.yaml';
  configs: Record<Library, ManualDocumentationConfig> = {
    [Library.VizComponents]: {} as ManualDocumentationConfig,
    [Library.UiComponents]: {} as ManualDocumentationConfig,
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
