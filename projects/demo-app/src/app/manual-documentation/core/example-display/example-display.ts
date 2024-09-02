import { Directive, inject, Input, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { ExamplesFilesService } from '../../../core/services/examples-files.service';

@Directive()
export abstract class ExampleDisplay implements OnInit {
  @Input() includeFiles: string[];
  @Input() height: string;
  @Input() label: string = 'example';
  @Input() maxHeight: string;
  @Input() maxWidth: string = '1200px';
  @Input() path: string;
  fileList: string[];
  filesHtml$: Observable<string[]>;
  selectedTabIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedTabIndex$ = this.selectedTabIndex.asObservable();
  tabList: string[];
  tabContent$: Observable<string | null>;
  private filesService = inject(ExamplesFilesService);

  abstract initTabs(): void;

  ngOnInit(): void {
    this.setFileList();
    this.setFilesHtml();
    this.initTabs();
  }

  setFileList(): void {
    const componentName = this.path.split('/').slice(-1)[0];
    const baseSourceUrl = `${this.path}/${componentName}.component`;
    const fileList = ['ts', 'html', 'scss'].map(
      (extension) => `${baseSourceUrl}.${extension}`
    );
    if (this.includeFiles !== undefined) {
      this.includeFiles.forEach((fileName) =>
        fileList.push(`${this.path}/${fileName}`)
      );
    }
    this.fileList = fileList;
  }

  setFilesHtml(): void {
    this.filesHtml$ = forkJoin(
      this.fileList.map((fileName) =>
        this.filesService.getComponentCode(fileName)
      )
    );
  }

  getFileDisplayName(fullFilePath: string): string {
    return fullFilePath.match(/([^/]+)$/)[0];
  }

  onTabChange(index: number): void {
    this.selectedTabIndex.next(index);
  }
}
