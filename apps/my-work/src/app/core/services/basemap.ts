import { GeoJsonProperties } from 'geojson';
import { GeometryCollection, Objects, Topology } from 'topojson-specification';

export interface MapObjects extends Objects {
  country: GeometryCollection<MapGeometryProperties>;
  states: GeometryCollection<MapGeometryProperties>;
}

export interface MapGeometryProperties extends GeoJsonProperties {
  name: string;
  id: string;
}

export type UsMapTopology = Topology<MapObjects>;

export interface CountyObjects extends Objects {
  counties: GeometryCollection<CountyGeometryProperties>;
}

export interface CountyGeometryProperties extends GeoJsonProperties {
  name: string;
  id: string;
}

export type UsCountyTopology = Topology<CountyObjects>;
