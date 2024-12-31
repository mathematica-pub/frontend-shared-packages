import { GeoJsonProperties } from 'geojson';
import { GeometryCollection, Objects, Topology } from 'topojson-specification';

export interface MapObjects extends Objects {
  country: GeometryCollection<MapGeometryProperties>;
  states: GeometryCollection<MapGeometryProperties>;
  counties: GeometryCollection<MapGeometryProperties>;
}

export interface MapGeometryProperties extends GeoJsonProperties {
  name: string;
  id: string;
}

export type UsMapTopology = Topology<MapObjects>;
