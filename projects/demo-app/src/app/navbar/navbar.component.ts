import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
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

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.navbarConfig$ = this.http
      .get('assets/documentation/documentation-structure.yaml', {
        responseType: 'text',
      })
      .pipe(
        map((text) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const yamlObject: any = parse(text);
          const categories = Object.keys(yamlObject);
          return categories.map((category) => {
            return {
              name: category,
              files: Object.keys(yamlObject[category]),
            };
          });
        })
      );
  }
}
