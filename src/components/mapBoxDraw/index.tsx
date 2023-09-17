import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl, useMap } from "react-map-gl";
import { DrawControlProps } from "react-mapbox-gl-draw";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { area } from "@turf/turf";
import { useState } from "react";

const DrawMapPolygon = ({
  controls,
  displayControlsDefault,
}: DrawControlProps) => {
  const [calculatedArea, setCalculatedArea] = useState(0);
  const { current: map } = useMap();
  const draw = new MapboxDraw({ controls, displayControlsDefault });

  useControl(() => {
    map?.on("draw.create", (e) => {
      const result = area(e.features[0].geometry);
      setCalculatedArea(Math.round(result * 0.000001 * 100) / 100);
    });
    map?.on("draw.update", () => {});
    map?.on("draw.delete", () => {
      setCalculatedArea(0);
    });
    return draw;
  });

  return (
    <div
      style={{
        position: "fixed",
        zIndex: "99",
        left: "10px",
        top: "50px",
        width: "150px",
        height: "100px",
        backgroundColor: "#f5f5f5",
      }}
    >
      {`Area of selected polygon is equal to: ${calculatedArea} square kilometers`}
    </div>
  );
};

export default DrawMapPolygon;
