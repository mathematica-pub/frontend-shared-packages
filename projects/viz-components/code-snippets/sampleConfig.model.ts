export class SampleConfig {
  fieldA: number;
  nestedConfig: NestedConfig;
  nestedConfig2 = new NestedConfig();
  constructor(init?: Partial<SampleConfig>) {
    this.fieldA = 3.1;
    this.nestedConfig = new NestedConfig();
    Object.assign(this, init); // overwrite any defaults w/user supplied things
  }
}

export class NestedConfig {
  // comment about field A
  nestedFieldA = 'hello I am a nested field';
  nestedFieldB = 'some more stuff exists here';
  nestedFieldC: any;
  nestedFieldD: string;

  constructor(init?: Partial<NestedConfig>) {
    Object.assign(this, init);
  }
}
