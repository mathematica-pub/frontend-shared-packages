import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MapChartComponent } from '../../../charts';
import { VicAttributeDataDimensionConfig } from '../../../geographies';
import { VicAuxMarks } from '../../aux-marks/aux-marks';
import { MarksOptions } from '../../config/marks-options';

@Directive()
export abstract class VicMapAuxMarks<
    Datum,
    TMarksConfig extends MarksOptions<Datum>,
  >
  extends VicAuxMarks<Datum, TMarksConfig>
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
