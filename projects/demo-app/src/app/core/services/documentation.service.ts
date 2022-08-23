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
    geographies$: Observable<string>;
    groupedBars$: Observable<string>;
    htmlTooltip$: Observable<string>;
    lines$: Observable<string>;
    mapChart$: Observable<string>;
    map$: Observable<string>;
    mapLegend$: Observable<string>;
    stackedBars$: Observable<string>;
    xOrdinalAxis$: Observable<string>;
    xQuantitativeAxis$: Observable<string>;
    xyChartBackground$: Observable<string>;
    xyChart$: Observable<string>;
    yOrdinalAxis$: Observable<string>;
    yQuantitativeAxis$: Observable<string>;
    stackedArea$: Observable<string>;

    constructor(private http: HttpClient) {}

    setDocumentationData(): void {
        this.bars$ = this.getHttp(DocumentationType.Bars);
        this.chart$ = this.getHttp(DocumentationType.Chart);
        this.continuousLegend$ = this.getHttp(DocumentationType.ContinuousLegend);
        this.discontinuousLegend$ = this.getHttp(DocumentationType.DiscontinuousLegend);
        this.geographies$ = this.getHttp(DocumentationType.Geographies);
        this.groupedBars$ = this.getHttp(DocumentationType.GroupedBars);
        this.htmlTooltip$ = this.getHttp(DocumentationType.HtmlTooltip);
        this.lines$ = this.getHttp(DocumentationType.Lines);
        this.mapChart$ = this.getHttp(DocumentationType.MapChart);
        this.map$ = this.getHttp(DocumentationType.Map);
        this.mapLegend$ = this.getHttp(DocumentationType.MapLegend);
        this.stackedBars$ = this.getHttp(DocumentationType.StackedBars);
        this.xOrdinalAxis$ = this.getHttp(DocumentationType.XOrdinalAxis);
        this.xQuantitativeAxis$ = this.getHttp(DocumentationType.XQuantitativeAxis);
        this.xyChartBackground$ = this.getHttp(DocumentationType.XyChartBackground);
        this.xyChart$ = this.getHttp(DocumentationType.XyChart);
        this.yOrdinalAxis$ = this.getHttp(DocumentationType.YOrdinalAxis);
        this.yQuantitativeAxis$ = this.getHttp(DocumentationType.YQuantitativeAxis);
        this.stackedArea$ = this.getHttp(DocumentationType.StackedArea);
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
            case DocumentationType.Geographies:
                return this.geographies$;
            case DocumentationType.GroupedBars:
                return this.groupedBars$;
            case DocumentationType.HtmlTooltip:
                return this.htmlTooltip$;
            case DocumentationType.Lines:
                return this.lines$;
            case DocumentationType.MapChart:
                return this.mapChart$;
            case DocumentationType.Map:
                return this.map$;
            case DocumentationType.MapLegend:
                return this.mapLegend$;
            case DocumentationType.StackedBars:
                return this.stackedBars$;
            case DocumentationType.XOrdinalAxis:
                return this.xOrdinalAxis$;
            case DocumentationType.XQuantitativeAxis:
                return this.xQuantitativeAxis$;
            case DocumentationType.XyChartBackground:
                return this.xyChartBackground$;
            case DocumentationType.XyChart:
                return this.xyChart$;
            case DocumentationType.YOrdinalAxis:
                return this.yOrdinalAxis$;
            case DocumentationType.StackedArea:
                return this.stackedArea$;
            default:
                return null;
        }
    }

    private getHttp(input: string): Observable<string> {
        return this.http.get(`assets/documentation/${input}ComponentDocumentation.html`, {responseType: "text"});
    }
}