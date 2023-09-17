import type { FillLayer } from "react-map-gl";
import { useEffect, useState } from "react";
import { GeoJSONReader } from "../../utils/GeoJSONReader.tsx";
import { countriesCordsType } from "../../models/countiresCordsType.ts";

const useHandlePolygon = () => {
  const [countryCoords, setCountryCoords] = useState<countriesCordsType>();

  useEffect(() => {
    GeoJSONReader().then((res) => setCountryCoords(res));
  }, []);

  const sourceData = (country: string) => {
    return countryCoords?.features
      .filter((el) => el.properties["ADMIN"] === country)
      .map((el) => {
        return el.geometry;
      });
  };
  const polygonLayer: FillLayer = {
    id: "filled-polygon",
    type: "fill",
    source: "polygon",
    paint: {
      "fill-opacity": 0.8,
      "fill-color": "#0080ff",
    },
  };

  return {
    polygonLayer,
    sourceData,
  };
};

export default useHandlePolygon;
