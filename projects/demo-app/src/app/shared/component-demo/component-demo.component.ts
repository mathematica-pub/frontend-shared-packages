import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  inject,
  NgZone,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { Unsubscribe } from 'projects/viz-components/src/lib/shared/unsubscribe.class';
import { Observable, switchMap, takeUntil } from 'rxjs';
import { DocumentationService } from '../../core/services/documentation.service';

@Component({
  selector: 'app-component-demo',
  templateUrl: './component-demo.component.html',
  styleUrls: ['./component-demo.component.scss'],
  providers: [FormGroupDirective],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentDemoComponent
  extends Unsubscribe
  implements OnInit, AfterViewInit
{
  private router = inject(Router);
  private http = inject(HttpClient);
  private documentationService = inject(DocumentationService);
  private zone = inject(NgZone);
  controlPanel: FormGroup;
  fileList: string[];
  fileData$: Observable<string>;

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
  }

  ngAfterViewInit(): void {
    this.controlPanel.controls['selectedFile'].setValue(this.fileList[0]);
  }

  setFileList(baseString: string): void {
    const baseName = `app/${baseString}-example`;
    const baseSourceUrl = `${baseName}/${baseString}-example.component`;
    this.fileList = [
      `${baseSourceUrl}.ts`,
      `${baseSourceUrl}.html`,
      `${baseSourceUrl}.scss`,
    ];

    this.http
      .get(`${baseName}/include-files.txt`, {
        responseType: 'text',
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((text) => {
        const lines = text.split('\n');
        lines.forEach((line) => this.fileList.push(`${baseName}/${line}`));
      });
  }

  getFileDisplayName(fullFilePath: string): string {
    return fullFilePath.match(/([^/]+)$/)[0];
  }
}
