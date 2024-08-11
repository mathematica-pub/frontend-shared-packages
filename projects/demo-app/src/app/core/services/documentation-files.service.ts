import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentationFilesService {
  files: { [name: string]: Observable<string> } = {};

  constructor(private http: HttpClient) {}

  getDocumentation(name: string): Observable<string> {
    if (!this.files[name]) {
      this.files[name] = this.http.get(`assets${name + '.html'}`, {
        responseType: 'text',
      });
    }
    return this.files[name];
  }
}
