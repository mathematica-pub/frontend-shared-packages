import { Injectable } from '@angular/core';
import { FileResource } from '../resources/file.resource';

export interface ContentConfig {
  title: string;
  items: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ContentConfigService {
  basePath: string = '/app/core';
  fileName: string = 'config.yaml';
  config: ContentConfig = {} as ContentConfig;

  constructor(private files: FileResource) {}

  initConfig(): void {
    this.files
      .getYamlFile(this.basePath + '/' + this.fileName)
      .subscribe((config) => {
        this.config = config;
      });
  }
}
