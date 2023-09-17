import { Layer, Source } from "react-map-gl";

const SecondDrawPolygon = ({ polygons }: { polygons: number[][][] }) => {
  return (
    <div>
      {polygons.map((el, index) => {
        return (
          <Source type="geojson" data={{ type: "Polygon", coordinates: [el] }}>
            <Layer
              id={`polygon${index}`}
              type="fill"
              source="polygon"
              paint={{ "fill-opacity": 0.8, "fill-color": "#0080ff" }}
            />
          </Source>
        );
      })}

      {/*<Source*/}
      {/*  type="geojson"*/}
      {/*  data={{ type: "LineString", coordinates: el.map((item) => item) }}*/}
      {/*>*/}
      {/*  <Layer*/}
      {/*    id={`line${index}`}*/}
      {/*    type="line"*/}
      {/*    paint={{*/}
      {/*      "line-color": "#ff0000",*/}
      {/*      "line-width": 2,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</Source>*/}

      {/*<Marker*/}
      {/*  longitude={item[0]}*/}
      {/*  latitude={item[1]}*/}
      {/*  draggable*/}
      {/*  onDrag={(e) => {*/}
      {/*    const newCoords = (arr[index][i] = [e.lngLat.lng, e.lngLat.lat]);*/}
      {/*    console.log(newCoords);*/}
      {/*  }}*/}
      {/*/>*/}
    </div>
  );
};

export default SecondDrawPolygon;
