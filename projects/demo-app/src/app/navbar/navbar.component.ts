import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { parse } from 'yaml';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  navbarConfig$: Observable<any>;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.navbarConfig$ = this.http
      .get('assets/documentation/documentation-structure.yaml', {
        responseType: 'text',
      })
      .pipe(
        map((text) => {
          let yamlObject: Object = parse(text);
          let categories = Object.keys(yamlObject);
          return categories.map((category) => {
            return {
              name: category,
              files: Object.keys(yamlObject[category]),
            };
          });
        })
      );
    this.navbarConfig$.subscribe((x) => console.log(x));
  }
}
