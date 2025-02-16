import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MapChartComponent } from '../../../charts';
import { VicAttributeDataDimensionConfig } from '../../../geographies';
import { AuxMarks } from '../../aux-marks/aux-marks';
import { MarksConfig } from '../../config/marks-config';

@Directive()
export abstract class VicMapAuxMarks<Datum, TMarksConfig extends MarksConfig>
  extends AuxMarks<Datum, TMarksConfig>
  implements OnInit
{
  attributeDataConfig: VicAttributeDataDimensionConfig<Datum>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeDataScale: any;
  public override chart = inject(MapChartComponent);
  destroyRef = inject(DestroyRef);

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
    return this.chart.config.transitionDuration;
  }
}
