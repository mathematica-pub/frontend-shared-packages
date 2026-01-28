/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { XyChartComponent } from '@mathstack/viz';
import { OrdinalAxisStub } from '../../testing/stubs/ordinal-axis.stub';

describe('the OrdinalAxis mixin', () => {
  let abstractClass: OrdinalAxisStub<string>;
  const mockElementRef = {
    nativeElement: {
      querySelector: jasmine.createSpy('querySelector'),
      style: {},
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrdinalAxisStub,
        XyChartComponent,
        { provide: ElementRef, useValue: mockElementRef },
      ],
    });
    abstractClass = TestBed.inject(OrdinalAxisStub);
  });

  it('should be created', () => {
    expect(abstractClass).toBeTruthy();
  });
});
