import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResource } from '../resources/file.resource';

export interface ContentConfig {
  title: string;
  items: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ContentConfigService {
  basePath: string = '/app/content';
  fileName: string = 'content.yaml';
  config$: Observable<ContentConfig>;
  config: ContentConfig;

  constructor(private files: FileResource) {}

  initConfig(): void {
    this.config$ = this.files.getYamlFile(this.basePath + '/' + this.fileName);

    this.config$.subscribe((config: ContentConfig) => {
      this.config = config;
    });
  }
}
