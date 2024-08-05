/* eslint-disable  @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { StackedAreaComponentStub } from '../../testing/stubs/stacked-area.component.stub';
import { STACKED_AREA, StackedAreaComponent } from '../stacked-area.component';
import { StackedAreaInputEventDirective } from './stacked-area-input-event.directive';

describe('StackedAreaInputDirective', () => {
  let directive: StackedAreaInputEventDirective<
    any,
    string,
    StackedAreaComponent<any, string>
  >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StackedAreaInputEventDirective,
        {
          provide: STACKED_AREA,
          useValue: StackedAreaComponentStub,
        },
      ],
    });
    directive = TestBed.inject(
      StackedAreaInputEventDirective<
        any,
        string,
        StackedAreaComponent<any, string>
      >
    );
  });

  describe('handleNewEvent', () => {
    let actionA: any;
    let onStartASpy: jasmine.Spy;
    let onEndASpy: jasmine.Spy;
    let actionB: any;
    let onStartBSpy: jasmine.Spy;
    let onEndBSpy: jasmine.Spy;
    beforeEach(() => {
      onStartASpy = jasmine.createSpy('onStart');
      onEndASpy = jasmine.createSpy('onEnd');
      onStartBSpy = jasmine.createSpy('onStart');
      onEndBSpy = jasmine.createSpy('onEnd');
      actionA = {
        onStart: onStartASpy,
        onEnd: onEndASpy,
      };
      actionB = {
        onStart: onStartBSpy,
        onEnd: onEndBSpy,
      };
      directive.actions = [actionA, actionB];
    });
    it('calls onStart with the correct values if inputEvent is truthy', () => {
      directive.handleNewEvent('hello');
      expect(onStartASpy).toHaveBeenCalledWith(directive, 'hello');
      expect(onStartBSpy).toHaveBeenCalledWith(directive, 'hello');
    });
    it('does not call onEnd if inputEvent is truthy', () => {
      directive.handleNewEvent('hello');
      expect(onEndASpy).not.toHaveBeenCalled();
      expect(onEndBSpy).not.toHaveBeenCalled();
    });
    it('calls onEnd with the correct values if inputEvent is falsy', () => {
      directive.handleNewEvent(null);
      expect(onEndASpy).toHaveBeenCalledWith(directive, null);
      expect(onEndBSpy).toHaveBeenCalledWith(directive, null);
    });
    it('does not call onStart if inputEvent is falsy', () => {
      directive.handleNewEvent(null);
      expect(onStartASpy).not.toHaveBeenCalled();
      expect(onStartBSpy).not.toHaveBeenCalled();
    });
  });
});
