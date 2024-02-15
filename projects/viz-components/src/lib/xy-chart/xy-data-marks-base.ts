import {
  DestroyRef,
  Directive,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Ranges } from '../chart/chart.component';
import { NgOnChangesUtilities } from '../core/utilities/ng-on-changes';
import {
  XyChartComponent,
  XyChartScales,
  XyContentScale,
} from './xy-chart.component';

/**
 * @internal
 */
@Directive()
export abstract class XyDataMarksBase implements OnChanges, OnInit {
  ranges: Ranges;
  scales: XyChartScales;
  requiredScales: (keyof typeof XyContentScale)[] = [
    XyContentScale.x,
    XyContentScale.y,
    XyContentScale.category,
  ];
  public destroyRef = inject(DestroyRef);
  public chart = inject(XyChartComponent);

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
      NgOnChangesUtilities.inputObjectChangedNotFirstTime(changes, 'config')
    ) {
      this.initFromConfig();
    }
  }

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToScales();
    this.initFromConfig();
  }

  initFromConfig(): void {
    this.setPropertiesFromConfig();
    this.setChartScalesFromRanges(true);
  }

  subscribeToRanges(): void {
    this.chart.ranges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ranges) => {
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
        takeUntilDestroyed(this.destroyRef),
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
