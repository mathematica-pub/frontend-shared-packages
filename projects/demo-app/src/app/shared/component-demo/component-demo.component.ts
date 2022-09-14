import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { Unsubscribe } from 'projects/viz-components/src/lib/shared/unsubscribe.class';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-component-demo',
  templateUrl: './component-demo.component.html',
  styleUrls: ['./component-demo.component.scss'],
  providers: [FormGroupDirective],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentDemoComponent extends Unsubscribe implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  controlPanel: FormGroup;
  fileList: string[];

  ngOnInit(): void {
    this.setFileList(this.router.url.replace('/examples/', ''));
    this.controlPanel = new FormGroup({
      selectedFile: new FormControl(this.fileList[0]),
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
