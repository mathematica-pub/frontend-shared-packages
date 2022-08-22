import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentationType } from "../enums/documentation.enums";

@Injectable({
    providedIn: 'root'
})
export class DocumentationService {
    bars$: Observable<string>;
    chart$: Observable<string>;
    continuousLegend$: Observable<string>;
    discontinuousLegend$: Observable<string>;

    constructor(private http: HttpClient) {}

    setDocumentationData(): void {
        this.bars$ = this.getHttp(DocumentationType.Bars);
        this.chart$ = this.getHttp(DocumentationType.Chart);
        this.continuousLegend$ = this.getHttp(DocumentationType.ContinuousLegend);
        this.discontinuousLegend$ = this.getHttp(DocumentationType.DiscontinuousLegend);
    }

    getDocumentationByName(name: string): Observable<string> {
        switch (name) {
            case DocumentationType.Bars:
                return this.bars$;
            case DocumentationType.Chart:
                return this.chart$;
            case DocumentationType.ContinuousLegend:
                return this.continuousLegend$;
            case DocumentationType.DiscontinuousLegend:
                return this.discontinuousLegend$;
            default:
                return null;
        }
    }

    private getHttp(input: string): Observable<string> {
        return this.http.get(`assets/documentation/${input}ComponentDocumentation.html`, {responseType: "text"});
    }
}