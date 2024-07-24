import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { forkJoin, Observable, startWith, take } from 'rxjs';
import { DocumentationService } from '../core/services/documentation.service';
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
  @Input() folderName: string;
  form: FormGroup<{ selected: FormControl<number> }>;
  exampleLabel = 'Example';
  fileList: string[];
  tabList: string[];
  filesHtml: string[];
  fileData$: Observable<string[]>;
  selectedTabIndex$: Observable<number>;
  private documentationService = inject(DocumentationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getFilesForExample();
    this.initTabs();
  }

  getFilesForExample(): void {
    this.fileList = this.getFileList();
    forkJoin(
      this.fileList.map((fileName) =>
        this.documentationService.getDocumentation(fileName)
      )
    )
      .pipe(take(1))
      .subscribe((fileData) => {
        this.filesHtml = fileData;
      });
  }

  getFileList(): string[] {
    const baseName = `app/examples/${this.folderName}`;
    const baseSourceUrl = `${baseName}/${this.folderName}.component`;
    const fileList = [
      `${baseSourceUrl}.ts`,
      `${baseSourceUrl}.html`,
      `${baseSourceUrl}.scss`,
    ];
    if (this.includeFiles !== undefined) {
      this.includeFiles.forEach((fileName) =>
        fileList.push(`${baseName}/${fileName}`)
      );
    }
    return fileList;
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
    // a hack to help the charts render along after switching back to it
    // known problem, has to do with content projecting and ngif, not worth a different solution here imo
    this.selectedTabIndex$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((index) => {
        if (index === 0) {
          setTimeout(() => {
            return;
          });
        }
      });
  }

  getFileDisplayName(fullFilePath: string): string {
    return fullFilePath.match(/([^/]+)$/)[0];
  }
}
