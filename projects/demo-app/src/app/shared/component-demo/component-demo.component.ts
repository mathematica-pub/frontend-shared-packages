import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-demo',
  templateUrl: './component-demo.component.html',
  styleUrls: ['./component-demo.component.scss'],
  providers: [FormGroupDirective],
})
export class ComponentDemoComponent implements OnInit {
  private router = inject(Router);
  baseSourceUrl: string;
  controlPanel: FormGroup;

  ngOnInit(): void {
    const baseString = this.router.url.replace('/examples/', '');
    this.baseSourceUrl = `app/${baseString}/${baseString}.component.`;
    this.controlPanel = new FormGroup({
      selectedFile: new FormControl('ts'),
    });
  }
}
