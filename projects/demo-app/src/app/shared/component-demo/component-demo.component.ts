import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-demo',
  templateUrl: './component-demo.component.html',
  styleUrls: ['./component-demo.component.scss'],
  providers: [FormGroupDirective],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentDemoComponent implements OnInit {
  private router = inject(Router);
  baseSourceUrl: string;
  baseName: string;
  controlPanel: FormGroup;

  ngOnInit(): void {
    const baseString = this.router.url.replace('/examples/', '');
    this.baseName = `${baseString}.component.`;
    this.baseSourceUrl = `app/${baseString}/${this.baseName}`;
    this.controlPanel = new FormGroup({
      selectedFile: new FormControl('ts'),
    });
  }
}
