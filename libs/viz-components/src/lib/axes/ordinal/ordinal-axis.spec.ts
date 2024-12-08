/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { XyChartComponent } from '@hsi/viz-components';
import { OrdinalAxisStub } from '../../testing/stubs/ordinal-axis.stub';

describe('the OrdinalAxis mixin', () => {
  let abstractClass: OrdinalAxisStub<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdinalAxisStub, XyChartComponent],
    });
    abstractClass = TestBed.inject(OrdinalAxisStub);
  });

  it('should be created', () => {
    expect(abstractClass).toBeTruthy;
  });
});
