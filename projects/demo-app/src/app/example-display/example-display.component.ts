import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  forkJoin,
  map,
  Observable,
  shareReplay,
  startWith,
  withLatestFrom,
} from 'rxjs';
import { FilesService } from '../core/services/files.service';
import { RadioInputComponent } from '../radio-input/radio-input.component';
import { CodeDisplayComponent } from './code-display/code-display.component';

@Component({
  selector: 'app-example-display',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioInputComponent,
    CodeDisplayComponent,
  ],
  templateUrl: './example-display.component.html',
  styleUrls: ['./example-display.component.scss'],
  providers: [FormGroupDirective],
  encapsulation: ViewEncapsulation.None,
})
export class ExampleDisplayComponent implements OnInit {
  @Input() includeFiles: string[];
  @Input() path: string;
  form: FormGroup<{ selected: FormControl<number> }>;
  exampleLabel = 'example';
  fileList: string[];
  tabList: string[];
  filesHtml$: Observable<string[]>;
  selectedTabIndex$: Observable<number>;
  tabContent$: Observable<string | null>;
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

  initTabs(): void {
    this.tabList = [
      this.exampleLabel,
      ...this.fileList.map(this.getFileDisplayName),
    ];
    this.form = new FormGroup({
      selected: new FormControl<number>(0),
    });
    this.selectedTabIndex$ = this.form.controls.selected.valueChanges.pipe(
      startWith(0)
    );
  }

  getFileDisplayName(fullFilePath: string): string {
    return fullFilePath.match(/([^/]+)$/)[0];
  }

  initTabContent(): void {
    this.tabContent$ = this.selectedTabIndex$.pipe(
      withLatestFrom(this.filesHtml$),
      map(([index, filesHtml]) => {
        if (index === 0) {
          return null;
        }
        return filesHtml[index - 1];
      }),
      shareReplay(1)
    );
  }
}
