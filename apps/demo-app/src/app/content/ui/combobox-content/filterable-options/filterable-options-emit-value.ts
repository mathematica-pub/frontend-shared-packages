import { Directive } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterableOptions } from './filterable-options';

@Directive()
export abstract class FilterableOptionsEmitValue extends FilterableOptions {
  inputValue = new BehaviorSubject<string>('');
  inputValue$ = this.inputValue.asObservable();

  onTyping(value: string): void {
    this.inputValue.next(value);
  }
}
