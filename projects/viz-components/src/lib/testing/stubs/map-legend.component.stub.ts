import { VicCategoricalAttributeDataDimensionConfig } from '../../geographies/geographies.config';

export class MapLegendComponentStub {
  attributeDataConfig = new VicCategoricalAttributeDataDimensionConfig();

  constructor() {
    this.attributeDataConfig.range = ['red', 'blue'];
    this.attributeDataConfig.domain = ['a', 'b'];
  }
}
