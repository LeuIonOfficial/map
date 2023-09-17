import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Layer, Source, useControl } from "react-map-gl";
import { Dispatch, SetStateAction, useState } from "react";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { TOKEN } from "../../utils/mapToken.ts";
import useHandlePolygon from "../map/constants.ts";

const Geocoder = ({
  setViewPort,
}: {
  setViewPort: Dispatch<
    SetStateAction<{ longitude: number; latitude: number }>
  >;
}) => {
  const ctrl = new MapBoxGeocoder({
    accessToken: TOKEN,
    marker: false,
    collapsed: true,
  });

  const { polygonLayer, sourceData } = useHandlePolygon();

  const [countryName, setCountryName] = useState<string>("");

  const filterPolygon = sourceData(countryName);

  useControl(() =>
    ctrl.on("result", (e) => {
      const name =
        e.result.place_type[0] === "country" ? e.result.place_name : "";
      const cords = e.result.geometry.coordinates;
      setViewPort({ latitude: cords[1], longitude: cords[0] });
      setCountryName(name);
    }),
  );
  return (
    !!filterPolygon && (
      <Source type="geojson" data={filterPolygon[0]}>
        <Layer {...polygonLayer} />
      </Source>
    )
  );
};

export default Geocoder;
