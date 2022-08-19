import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DocumentationService {
    documentationData$: Observable<string>;

    constructor(private http: HttpClient) {}

    setDocumentationData(): void {
        this.documentationData$ = this.http.get('assets/BarsComponentDocumentation.html', {responseType: 'text'})
    }
}