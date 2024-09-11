import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { VicAttributeDataDimensionConfig } from '../../geographies';
import { MapChartComponent } from '../../map-chart';
import { AuxMarks } from '../../marks/aux-marks/aux-marks';
import { MarksOptions } from '../../marks/config/marks-options';

@Directive()
export abstract class MapAuxMarks<
    Datum,
    TMarksConfig extends MarksOptions<Datum>,
  >
  extends AuxMarks<Datum, TMarksConfig>
  implements OnInit
{
  attributeDataConfig: VicAttributeDataDimensionConfig<Datum>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeDataScale: any;
  public override chart = inject(MapChartComponent);

  constructor(private destroyRef: DestroyRef) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToAttributeDataProperties();
  }

  subscribeToAttributeDataProperties(): void {
    this.chart.attributeProperties$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((properties) => !!properties.scale && !!properties.config)
      )
      .subscribe((properties) => {
        this.attributeDataConfig = properties.config;
        this.attributeDataScale = properties.scale;
        this.drawMarks();
      });
  }

  getTransitionDuration(): number {
    return this.chart.transitionDuration;
  }
}
