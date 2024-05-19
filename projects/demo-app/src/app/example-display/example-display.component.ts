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
import { Unsubscribe } from 'projects/viz-components/src/lib/shared/unsubscribe.class';
import { Observable, startWith, switchMap } from 'rxjs';
import { DocumentationService } from '../core/services/documentation.service';
import { RenderFileComponent } from '../render-file/render-file.component';
import { RadioInputComponent } from '../shared/radio-input/radio-input.component';

@Component({
  standalone: true,
  selector: 'app-example-display',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioInputComponent,
    RenderFileComponent,
  ],
  templateUrl: './example-display.component.html',
  styleUrls: ['./example-display.component.scss'],
  providers: [FormGroupDirective],
  encapsulation: ViewEncapsulation.None,
})
export class ExampleDisplayComponent extends Unsubscribe implements OnInit {
  @Input() includeFiles: string[];
  @Input() folderName: string;
  controlPanel: FormGroup;
  fileList: string[];
  fileData$: Observable<string>;
  private documentationService = inject(DocumentationService);

  ngOnInit(): void {
    this.fileList = this.createFileList();
    const initialSelectedFile = this.fileList[0];
    this.controlPanel = new FormGroup({
      selectedFile: new FormControl(initialSelectedFile),
    });
    this.documentationService.getDocumentation(this.fileList[0]);
    this.fileData$ = this.controlPanel.controls[
      'selectedFile'
    ].valueChanges.pipe(
      startWith(initialSelectedFile),
      switchMap((fileName) =>
        this.documentationService.getDocumentation(fileName)
      )
    );
  }

  createFileList(): string[] {
    const baseName = `app/${this.folderName}`;
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

  getFileDisplayName(fullFilePath: string): string {
    return fullFilePath.match(/([^/]+)$/)[0];
  }
}
