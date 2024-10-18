/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Autocomplete,
  ComboboxService,
  OptionAction,
} from '../combobox.service';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { ComboboxMainServiceStub } from '../testing/main.service.stub';
import { ListboxComponent } from './listbox.component';

describe('ListboxComponent', () => {
  let component: ListboxComponent<any>;
  let fixture: ComponentFixture<ListboxComponent<any>>;
  let mainServiceStub: ComboboxMainServiceStub;

  beforeEach(() => {
    mainServiceStub = new ComboboxMainServiceStub();
    TestBed.configureTestingModule({
      declarations: [ListboxComponent],
      providers: [
        {
          provide: ComboboxService,
          useValue: mainServiceStub.comboboxServiceStub,
        },
        {
          provide: ListboxFilteringService,
          useValue: mainServiceStub.listboxFilteringServiceStub,
        },
        {
          provide: ListboxScrollService,
          useValue: mainServiceStub.listboxScrollServiceStub,
        },
      ],
    });
    fixture = TestBed.createComponent(ListboxComponent);
    component = fixture.componentInstance;
  });

  describe('setActiveIndex', () => {
    let optionsSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component.activeIndex, 'next');
      spyOn(component, 'handleScrollingForNewIndex');
      optionsSpy = spyOnProperty(component, 'allOptionsArray', 'get');
      mainServiceStub.comboboxServiceStub.autocomplete = Autocomplete.none;
    });
    it('should set activeIndex to the input value if its option is not disabled', () => {
      const options = [
        { value: 0, isDisabled: () => false },
        { value: 1, isDisabled: () => false },
        { value: 2, isDisabled: () => false },
        { value: 3, isDisabled: () => false },
        { value: 4, isDisabled: () => false },
        { value: 5, isDisabled: () => false },
      ] as any;
      optionsSpy.and.returnValue(options);
      component.setActiveIndex(2, null);
      expect(component.activeIndex.next).toHaveBeenCalledWith(2);
    });
    describe('if the option for the input value is disabled', () => {
      beforeEach(() => {
        const options = [
          { value: 0, isDisabled: () => false },
          { value: 1, isDisabled: () => false },
          { value: 2, isDisabled: () => true },
          { value: 3, isDisabled: () => false },
          { value: 4, isDisabled: () => false },
          { value: 5, isDisabled: () => false },
        ] as any;
        optionsSpy.and.returnValue(options as any);
      });
      describe('if the actionIfDisabled is next', () => {
        it('should set activeIndex to the next non-disabled option - case next is not disabled', () => {
          component.setActiveIndex(2, OptionAction.next);
          expect(component.activeIndex.next).toHaveBeenCalledWith(3);
        });
        it('should set activeIndex to the next non-disabled option - case next is disabled', () => {
          const options = [
            { value: 0, isDisabled: () => false },
            { value: 1, isDisabled: () => false },
            { value: 2, isDisabled: () => true },
            { value: 3, isDisabled: () => true },
            { value: 4, isDisabled: () => false },
            { value: 5, isDisabled: () => false },
          ] as any;
          optionsSpy.and.returnValue(options as any);
          component.setActiveIndex(2, OptionAction.next);
          expect(component.activeIndex.next).toHaveBeenCalledWith(4);
        });
        it('should set not set activeIndex - case all options until end of array are disabled', () => {
          const options = [
            { value: 0, isDisabled: () => false },
            { value: 1, isDisabled: () => false },
            { value: 2, isDisabled: () => true },
            { value: 3, isDisabled: () => true },
            { value: 4, isDisabled: () => true },
            { value: 5, isDisabled: () => true },
          ] as any;
          optionsSpy.and.returnValue(options as any);
          component.setActiveIndex(2, OptionAction.next);
          expect(component.activeIndex.next).not.toHaveBeenCalled();
        });
      });
      describe('if the actionIfDisabled is previous', () => {
        it('should set activeIndex to the previous non-disabled option - case previous is not disabled', () => {
          const options = [
            { value: 0, isDisabled: () => false },
            { value: 1, isDisabled: () => false },
            { value: 2, isDisabled: () => true },
            { value: 3, isDisabled: () => false },
            { value: 4, isDisabled: () => false },
            { value: 5, isDisabled: () => false },
          ] as any;
          optionsSpy.and.returnValue(options as any);
          component.setActiveIndex(2, OptionAction.previous);
          expect(component.activeIndex.next).toHaveBeenCalledWith(1);
        });
        it('should set activeIndex to the previous non-disabled option - case previous is disabled', () => {
          const options = [
            { value: 0, isDisabled: () => false },
            { value: 1, isDisabled: () => true },
            { value: 2, isDisabled: () => true },
            { value: 3, isDisabled: () => false },
            { value: 4, isDisabled: () => false },
            { value: 5, isDisabled: () => false },
          ] as any;
          optionsSpy.and.returnValue(options as any);
          component.setActiveIndex(2, OptionAction.previous);
          expect(component.activeIndex.next).toHaveBeenCalledWith(0);
        });
        it('should set not set activeIndex - case all options until start of array are disabled', () => {
          const options = [
            { value: 0, isDisabled: () => true },
            { value: 1, isDisabled: () => true },
            { value: 2, isDisabled: () => true },
            { value: 3, isDisabled: () => false },
            { value: 4, isDisabled: () => false },
            { value: 5, isDisabled: () => false },
          ] as any;
          optionsSpy.and.returnValue(options as any);
          component.setActiveIndex(2, OptionAction.previous);
          expect(component.activeIndex.next).not.toHaveBeenCalled();
        });
      });
    });
    describe('if all options are disabled', () => {
      beforeEach(() => {
        const newOptions = [
          { value: 0, isDisabled: () => true },
          { value: 1, isDisabled: () => true },
          { value: 2, isDisabled: () => true },
          { value: 3, isDisabled: () => true },
          { value: 4, isDisabled: () => true },
          { value: 5, isDisabled: () => true },
        ] as any;
        optionsSpy.and.returnValue(newOptions as any);
      });
      it('does not call activeIndex.next - action is next', () => {
        component.setActiveIndex(2, OptionAction.next);
        expect(component.activeIndex.next).toHaveBeenCalledTimes(0);
      });
      it('does not call activeIndex.next - action is previous', () => {
        component.setActiveIndex(2, OptionAction.previous);
        expect(component.activeIndex.next).toHaveBeenCalledTimes(0);
      });
    });
  });
});
