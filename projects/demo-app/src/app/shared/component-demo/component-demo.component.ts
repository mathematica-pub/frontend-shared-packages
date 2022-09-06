import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-demo',
  templateUrl: './component-demo.component.html',
  styleUrls: ['./component-demo.component.scss'],
})
export class ComponentDemoComponent implements OnInit {
  private router = inject(Router);
  baseSourceUrl: string;
  ngOnInit(): void {
    const baseString = this.router.url.replace('/examples/', '');
    this.baseSourceUrl = `app/${baseString}/${baseString}.component.`;
  }
}
