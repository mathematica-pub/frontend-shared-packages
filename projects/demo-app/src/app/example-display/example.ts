import { Directive } from '@angular/core';

export interface ExampleProperties {
  directoryPath: string;
}

@Directive()
export class Example implements ExampleProperties {
  directoryPath: string;

  constructor(directoryPath: string) {
    this.directoryPath = directoryPath;
  }
}
