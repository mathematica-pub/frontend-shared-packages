import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
          for (const category in yamlObject) {
            for (const subcategory in yamlObject[category]) {
              if (category == 'library-internals') {
                yamlObject[category][subcategory] = {
                  addOns: [...Object.keys(yamlObject[category][subcategory])],
                };
              } else {
                yamlObject[category][subcategory] = {
                  addOns: [],
                };
              }
            }
          }
          for (const category in addOns) {
            for (const subcategory in addOns[category]) {
              if (subcategory == 'all') {
                for (const yamlSubcategory in yamlObject[category]) {
                  const currentSubcategory =
                    yamlObject[category][yamlSubcategory];
                  yamlObject[category][yamlSubcategory].addOns = [
                    ...currentSubcategory.addOns,
                    ...Object.keys(addOns[category][subcategory]).map(
                      (filePath) => `all/${filePath}`
                    ),
                  ];
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
  getLink(category: string, subcategory: string, fileName: string): string {
    if (category === 'library-internals') {
      return `/documentation/${category}/${subcategory}/${fileName}`;
    }
    if (fileName.includes('all')) {
      return `/documentation/add-ons/${category}/${fileName}`;
    }
    return `/documentation/add-ons/${category}/${subcategory}/${fileName}`;
  }
  getFileName(fileName: string): string {
    return fileName.replace('all/', '');
  }
  expandLinks(category: string, subcategory: string) {
    const url = this.router.url;
    if (url.includes('all') && url.includes(category)) {
      return true;
    }
    return url.includes(category) && url.includes(subcategory);
  }
}
