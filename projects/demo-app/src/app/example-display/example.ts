import { Directive, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { FilesService } from '../core/services/files.service';

export interface ExampleProperties {
  path: string;
}

@Directive()
export abstract class Example implements OnInit {
  @Input() includeFiles: string[];
  @Input() path: string;
  fileList: string[];
  filesHtml$: Observable<string[]>;
  tabList: string[];
  selectedTabIndex$: Observable<number>;
  tabContent$: Observable<string | null>;
  form: FormGroup<{ selected: FormControl<number> }>;
  private filesService = inject(FilesService);

  ngOnInit(): void {
    this.setFileList();
    this.setFilesHtml();
    this.initTabs();
    this.initTabContent();
  }

  setFileList(): void {
    const componentName = this.path.split('/').slice(-1)[0];
    const baseSourceUrl = `${this.path}/${componentName}.component`;
    const fileList = ['ts', 'html', 'scss'].map(
      (extension) => `${baseSourceUrl}.${extension}`
    );
    if (this.includeFiles !== undefined) {
      this.includeFiles.forEach((fileName) =>
        fileList.push(`${componentName}/${fileName}`)
      );
    }
    this.fileList = fileList;
  }

  setFilesHtml(): void {
    this.filesHtml$ = forkJoin(
      this.fileList.map((fileName) => this.filesService.getCode(fileName))
    );
  }

  getFileDisplayName(fullFilePath: string): string {
    return fullFilePath.match(/([^/]+)$/)[0];
  }

  abstract initTabs(): void;
  abstract initTabContent(): void;
}
