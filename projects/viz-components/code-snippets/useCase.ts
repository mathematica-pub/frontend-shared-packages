import { NestedConfig, SampleConfig } from './sampleConfig.model';

var myconfig = new SampleConfig({
  fieldA: 3.1,
  nestedConfig: new NestedConfig({
    // comment about field A
    nestedFieldA: 'hello I am a nested field',
    nestedFieldB: 'some more stuff exists here',
    //nestedFieldD: string
  }),
  nestedConfig2: new NestedConfig(),
});
