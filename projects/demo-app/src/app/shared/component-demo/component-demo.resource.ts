import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComponentDemoResource {
  constructor(private http: HttpClient) {}

  getDemoText(baseName: string): Observable<string> {
    return this.http.get(`${baseName}/include-files.txt`, {
      responseType: 'text',
    });
  }
}
