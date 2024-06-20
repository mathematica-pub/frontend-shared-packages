export interface VicGeographiesTooltipOutput<Datum> {
  datum?: Datum;
  color: string;
  geography: string;
  attributeValue?: string;
}

export interface VicGeographiesEventOutput<Datum>
  extends VicGeographiesTooltipOutput<Datum> {
  positionX: number;
  positionY: number;
}

// export function getGeographiesTooltipData<
//   Datum,
//   TProperties,
//   TGeometry extends Geometry,
//   TComponent extends GeographiesComponent<Datum, TProperties, TGeometry>
// >(
//   path: SVGPathElement,
//   component: TComponent
// ): VicGeographiesTooltipOutput<Datum> {
//   const config =
// //     component.config.noDataLayers[
// //       parseFloat(path.getAttribute('layer-index')) - 1
// //     ];
//   const feature = select(path).datum() as VicGeographiesFeature<
//     TProperties,
//     TGeometry
//   >;
//   const hasAttributeData = path.getAttribute('has-attribute-data') === 'true';
//   const featureIndex = component.config.featureIndexAccessor(feature);
//   return hasAttributeData
//     ? getTooltipDataForAttributeDataPath(featureIndex, component)
//     : getTooltipDataForNoAttributeDataPath(
//         path,
//         feature,
//         featureIndex,
//         component
//       );
// }

// function getTooltipDataForAttributeDataPath<
//   Datum,
//   TProperties,
//   TGeometry extends Geometry,
//   TComponent extends GeographiesComponent<Datum, TProperties, TGeometry>
// >(
//   featureIndex: string,
//   component: TComponent
// ): VicGeographiesTooltipOutput<Datum> {
//   const datum = component.config.dataLayer.datumsByGeographyIndex.get(featureIndex);
//   const value =
//     component.config.attributeValuesByGeographyIndex.get(featureIndex);

//   const tooltipData: VicGeographiesTooltipOutput<Datum> = {
//     datum,
//     geography: component.config.dataLayer.attributeData.geoAccessor(datum),
//     attributeValue: ValueUtilities.formatValue(
//       value,
//       component.config.dataLayer.attributeData.valueFormat
//     ),
//     color: component.config.dataLayer.getAttributeFill(
//       featureIndex,
//       component.attributeDataScale
//     ),
//   };

//   return tooltipData;
// }

// function getTooltipDataForNoAttributeDataPath<
//   Datum,
//   TProperties,
//   TGeometry extends Geometry,
//   TComponent extends GeographiesComponent<Datum, TProperties, TGeometry>
// >(
//   path: SVGPathElement,
//   feature: VicGeographiesFeature<TProperties, TGeometry>,
//   featureIndex: string,
//   component: TComponent
// ): VicGeographiesTooltipOutput<Datum> {
//   const config =
//     component.config.noDataLayers[
//       parseFloat(path.getAttribute('layer-index')) - 1
//     ];
//   const tooltipData: VicGeographiesTooltipOutput<Datum> = {
//     datum: undefined,
//     geography: featureIndex,
//     attributeValue: undefined,
//     color: config.getFill(feature, component.config.featureIndexAccessor),
//   };

//   return tooltipData;
// }
