import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { parse } from 'yaml';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navbarConfig$: Observable<any>;
  examples = ['bars', 'stacked-area', 'lines', 'geographies'];

  private http = inject(HttpClient);
  router = inject(Router);

  matchOptions: IsActiveMatchOptions = {
    paths: 'subset',
    matrixParams: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
  };
  ngOnInit(): void {
    this.navbarConfig$ = this.http
      .get('assets/documentation/documentation-structure.yaml', {
        responseType: 'text',
      })
      .pipe(
        map((text) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const yamlObject: any = parse(text);
          const addOns = Object.assign({}, yamlObject['add-ons']);
          delete yamlObject['add-ons'];
          delete yamlObject['library-internals'];
          for (const category in yamlObject) {
            // if (category == 'library-internals') continue;
            for (const subcategory in yamlObject[category]) {
              yamlObject[category][subcategory] = {
                addOns: [],
              };
            }
          }
          for (const category in addOns) {
            for (const subcategory in addOns[category]) {
              console.log(subcategory);
              if (subcategory == 'all') {
                for (const yamlSubcategory in yamlObject[category]) {
                  const currentSubcategory =
                    yamlObject[category][yamlSubcategory];
                  yamlObject[category][yamlSubcategory].addOns = [
                    ...currentSubcategory.addOns,
                    ...Object.keys(addOns[category][subcategory]),
                  ];
                  console.log(yamlObject[category][yamlSubcategory]);
                }
              } else {
                const currentSubcategory = yamlObject[category][subcategory];
                yamlObject[category][subcategory].addOns = [
                  ...currentSubcategory.addOns,
                  ...Object.keys(addOns[category][subcategory]),
                ];
              }
            }
          }
          return yamlObject;
        })
      );
  }
}
