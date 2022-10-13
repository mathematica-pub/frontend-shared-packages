import {
  Component,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { Unsubscribe } from 'projects/viz-components/src/lib/shared/unsubscribe.class';
import { Observable, switchMap } from 'rxjs';
import { DocumentationService } from '../../core/services/documentation.service';

@Component({
  selector: 'app-component-demo',
  templateUrl: './component-demo.component.html',
  styleUrls: ['./component-demo.component.scss'],
  providers: [FormGroupDirective],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentDemoComponent extends Unsubscribe implements OnInit {
  @Input() includeFiles: string[];
  controlPanel: FormGroup;
  fileList: string[];
  fileData$: Observable<string>;
  private documentationService = inject(DocumentationService);
  private router = inject(Router);

  ngOnInit(): void {
    this.setFileList(this.router.url.replace('/examples/', ''));
    this.controlPanel = new FormGroup({
      selectedFile: new FormControl(),
    });
    this.fileData$ = this.controlPanel.controls[
      'selectedFile'
    ].valueChanges.pipe(
      switchMap((fileName) =>
        this.documentationService.getDocumentation(fileName)
      )
    );
    setTimeout(() => {
      this.initFormValue();
    });
  }

  setFileList(baseString: string): void {
    const baseName = `app/${baseString}-example`;
    const baseSourceUrl = `${baseName}/${baseString}-example.component`;
    this.fileList = [
      `${baseSourceUrl}.ts`,
      `${baseSourceUrl}.html`,
      `${baseSourceUrl}.scss`,
    ];
    if (this.includeFiles !== undefined) {
      this.includeFiles.forEach((fileName) =>
        this.fileList.push(`${baseName}/${fileName}`)
      );
    }
  }

  initFormValue(): void {
    this.controlPanel.controls['selectedFile'].setValue(this.fileList[0]);
  }

  getFileDisplayName(fullFilePath: string): string {
    return fullFilePath.match(/([^/]+)$/)[0];
  }
}
