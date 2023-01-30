import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { parse } from 'yaml';
import { Example } from '../core/models/example';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navbarConfig$: Observable<any>;
  examples: Example[] = ['bars', 'stacked-area', 'lines', 'geographies'];
  baseFolder = '/documentation';

  private http = inject(HttpClient);
  router = inject(Router);

  ngOnInit(): void {
    this.navbarConfig$ = this.http
      .get('assets/documentation/documentation-structure.yaml', {
        responseType: 'text',
      })
      .pipe(
        map((text) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const yamlObject: any = parse(text);
          return this.sortYaml(yamlObject);
        })
      );
  }

  sortYaml(yaml: any): any {
    const returnArray = Object.entries(yaml)
      .map((entry) => {
        return {
          name: entry[0],
          contents: entry[1],
          isFile: typeof entry[1] === 'string',
        };
      })
      .sort((a, b) => {
        if (a.isFile && !b.isFile) return 1;
        if (!a.isFile && b.isFile) return -1;
        return a.name.localeCompare(b.name);
      });

    returnArray
      .filter((entry) => !entry.isFile)
      .forEach((entry) => (entry.contents = this.sortYaml(entry.contents)));
    return returnArray;
  }
}
