import { Directive, Input, OnInit } from '@angular/core';

@Directive()
export abstract class FilterableOptions implements OnInit {
  @Input() hasInitialValue = false;
  options: { displayName: string; id: string }[] = [
    { displayName: 'Connecticut', id: 'CT' },
    { displayName: 'Maine', id: 'ME' },
    { displayName: 'Massachusetts', id: 'MA' },
    { displayName: 'New Hampshire', id: 'NH' },
    { displayName: 'Rhode Island', id: 'RI' },
    { displayName: 'Vermont', id: 'VT' },
  ];

  abstract init(): void;

  ngOnInit(): void {
    this.init();
  }

  optionIncludesSearchText(
    option: { displayName: string; id: string },
    value: string
  ): boolean {
    return option.displayName.toLowerCase().includes(value?.toLowerCase());
  }
}
