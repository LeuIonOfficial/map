export type countriesCordsType = {
  type: string;
  features: {
    geometry:
      | GeoJSON.Feature<GeoJSON.Geometry>
      | GeoJSON.FeatureCollection<GeoJSON.Geometry>;
    properties: {
      ADMIN: string;
      ISO_A3: string;
    };
    type: string;
  }[];
};
