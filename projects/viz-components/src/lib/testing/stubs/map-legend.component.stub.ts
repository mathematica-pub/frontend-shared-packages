import { CategoricalAttributeDataDimensionConfig } from '../../geographies/geographies.config';

export class MapLegendComponentStub {
  attributeDataConfig = new CategoricalAttributeDataDimensionConfig();

  constructor() {
    this.attributeDataConfig.range = ['red', 'blue'];
    this.attributeDataConfig.domain = ['a', 'b'];
  }
}
