import { Injectable } from '@angular/core';
import { ManualDocumentationConfig } from 'projects/demo-app/src/app/manual-documentation/viz-components/config';
import { FileResource } from '../resources/file.resource';

@Injectable({
  providedIn: 'root',
})
export class ManualDocumentationConfigService {
  basePath: string = '/app/manual-documentation/';
  fileName: string = 'config.yaml';
  config: ManualDocumentationConfig = {} as ManualDocumentationConfig;

  constructor(private files: FileResource) {}

  initConfigs(): void {
    this.files
      .getYamlFile(this.basePath + '/' + this.fileName)
      .subscribe((configs) => {
        (config: ManualDocumentationConfig, index: number) => {
          this.config = config;
        };
      });
  }
}
