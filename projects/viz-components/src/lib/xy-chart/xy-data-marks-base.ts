import {
  Directive,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { filter, takeUntil } from 'rxjs';
import { Ranges } from '../chart/chart.component';
import { UtilitiesService } from '../core/services/utilities.service';
import { Unsubscribe } from '../shared/unsubscribe.class';
import {
  XyChartComponent,
  XyChartScales,
  XyContentScale,
} from './xy-chart.component';

/**
 * @internal
 */
@Directive()
export abstract class XyDataMarksBase
  extends Unsubscribe
  implements OnChanges, OnInit
{
  ranges: Ranges;
  scales: XyChartScales;
  requiredScales: (keyof typeof XyContentScale)[];
  public chart = inject(XyChartComponent);
  protected utilities = inject(UtilitiesService);

  /**
   * setPropertiesFromConfig method
   *
   * This method handles an update to the config object. Methods called from here should not
   * requires ranges or scales. This method is called on init and on config update.
   */
  abstract setPropertiesFromConfig(): void;

  /**
   * setChartScalesFromRanges method
   *
   * This method sets creates and sets scales on ChartComponent. Any methods that require ranges
   * to create the scales should be called from this method. Methods called from here should not
   * require scales.
   *
   * This method is called on init, after config-based properties are set, and also on
   * resize/when ranges change.
   */
  abstract setChartScalesFromRanges(useTransition: boolean): void;
  /**
   * drawMarks method
   *
   * All methods that require scales should be called from drawMarks. Methods
   * called from here should use scale.domain() or scale.range() to obtain those values
   * rather than this.config.dimension.domain or this.ranges.dimension.
   *
   * This method is called when scales emit from ChartComponent.
   */
  abstract drawMarks(): void;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.utilities.objectOnNgChangesChangedNotFirstTime(changes, 'config')
    ) {
      this.initFromConfig();
    }
  }

  ngOnInit(): void {
    this.setRequiredChartScales();
    this.subscribeToRanges();
    this.subscribeToScales();
    this.initFromConfig();
  }

  initFromConfig(): void {
    this.setPropertiesFromConfig();
    this.setChartScalesFromRanges(true);
  }

  setRequiredChartScales(): void {
    this.requiredScales = [
      XyContentScale.x,
      XyContentScale.y,
      XyContentScale.category,
    ];
  }

  subscribeToRanges(): void {
    this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
      this.ranges = ranges;
      if (
        this.scales &&
        this.requiredScales.every((scale) => this.scales[scale])
      ) {
        this.resizeMarks();
      }
    });
  }

  subscribeToScales(): void {
    this.chart.scales$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((scales) => !!scales)
      )
      .subscribe((scales): void => {
        this.scales = scales;
        this.drawMarks();
      });
  }

  resizeMarks(): void {
    this.setChartScalesFromRanges(false);
  }

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }
}
