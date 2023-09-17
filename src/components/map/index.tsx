import "mapbox-gl/dist/mapbox-gl.css";
import { Layer, Map, Marker, NavigationControl, Source } from "react-map-gl";
import { useEffect, useState } from "react";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { TOKEN } from "../../utils/mapToken.ts";

const randColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase()
  );
};

const MapComponent = () => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [coords, setCoords] = useState<number[][]>([]);
  const [polygons, setPolygons] = useState<number[][][]>([]);
  const [liveLoc, setLiveLoc] = useState<number[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [storeDeletedCords, setStoreDeletedCords] = useState<number[]>([]);

  const handleClick = () => {
    if (isDrawing) setCoords((prevState) => [...prevState, liveLoc]);
  };

  const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
    setLiveLoc([e?.lngLat.lng, e?.lngLat.lat]);
  };

  const handleMarkerDragEnd = (
    index: number,
    markerIndex: number,
    lngLat: { lng: number; lat: number },
  ) => {
    const updatedPolygons = [...polygons];
    updatedPolygons[index][markerIndex] = [lngLat.lng, lngLat.lat];
    setPolygons(updatedPolygons);
  };

  const handleUndo = () => {
    setIsDrawing(true);

    if (coords.length && !polygons.length) {
      const store = coords.pop();
      store && setStoreDeletedCords(store);
    }

    if (polygons.length && coords.length) {
      const store = coords.pop();
      store && setStoreDeletedCords(store);
    }

    if (polygons.length && !coords.length) {
      setCoords(polygons[polygons.length - 1]);
      polygons.pop();
    }
  };
  const handleReturnUndo = () => {
    if (storeDeletedCords.length) {
      setCoords((prev) => [...prev, storeDeletedCords]);
      setStoreDeletedCords([]);
    }
  };

  useEffect(() => {
    const newColor = randColor();
    setColor((prev) => [...prev, newColor]);
  }, [polygons]);

  return (
    <div>
      <Map
        mapboxAccessToken={TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{
          width: "100vw",
          height: "100vh",
        }}
        initialViewState={{
          latitude: 46.58,
          longitude: 28.23,
          zoom: 8,
        }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        <button
          style={{ position: "fixed", zIndex: "99", top: "10px", left: "10px" }}
          onClick={() => setIsDrawing(!isDrawing)}
        >
          Draw polygon
        </button>
        <button
          style={{ position: "fixed", zIndex: "99", top: "40px", left: "10px" }}
          onClick={handleUndo}
        >
          Undo
        </button>
        <button
          style={{ position: "fixed", zIndex: "99", top: "70px", left: "10px" }}
          onClick={handleReturnUndo}
        >
          Return undo
        </button>
        <NavigationControl position="bottom-right" />
        {coords.map((el, index, array: number[][]) => {
          return (
            <div key={index}>
              <Marker
                longitude={el[0]}
                latitude={el[1]}
                key={index}
                draggable
                onDrag={(e) => (array[index] = [e.lngLat.lng, e.lngLat.lat])}
                onClick={() => {
                  if (index === 0) {
                    setIsDrawing(false);
                    const closedCoords: number[][] = [...coords];
                    setPolygons((prevState) => [...prevState, closedCoords]);
                    setCoords([]);
                  }
                }}
              />
            </div>
          );
        })}
        <Source
          type="geojson"
          data={{
            type: "LineString",
            coordinates: coords.map((el) => [el[0], el[el.length - 1]]),
          }}
        >
          <Layer
            id={`pointsline`}
            type="line"
            paint={{
              "line-color": "#ff0000",
              "line-width": 2,
            }}
          />
        </Source>
        {isDrawing && coords.length > 0 && (
          <Source
            type="geojson"
            data={{
              type: "LineString",
              coordinates: [coords[coords.length - 1], liveLoc],
            }}
          >
            <Layer
              id={`liveLine`}
              type="line"
              paint={{
                "line-color": "#ff0000",
                "line-width": 1,
              }}
            />
          </Source>
        )}
        {/*<Geocoder setViewPort={setViewPort} />*/}
        {/*<SecondDrawPolygon polygons={polygons} />*/}
        <div>
          {polygons.map((el, index, array) => {
            return (
              <div key={index}>
                <Source
                  type="geojson"
                  data={{
                    type: "Polygon",
                    coordinates: [[...el]],
                  }}
                >
                  <Layer
                    id={`polygon${index}`}
                    type="fill"
                    source="polygon"
                    paint={{ "fill-opacity": 0.5, "fill-color": color[index] }}
                  />
                </Source>
                <Source
                  type="geojson"
                  data={{
                    type: "LineString",
                    coordinates: [...el, el[0]],
                  }}
                >
                  <Layer
                    id={`line${index}`}
                    type="line"
                    paint={{
                      "line-color": "#ff0000",
                      "line-width": 1,
                    }}
                  />
                </Source>
                {el.map((item, i) => {
                  return (
                    <Marker
                      longitude={item[0]}
                      latitude={item[1]}
                      onDrag={(e) => {
                        array[index][i] = [e.lngLat.lng, e.lngLat.lat];
                      }}
                      draggable
                      key={i}
                      onDragEnd={(e) => {
                        handleMarkerDragEnd(index, i, e.lngLat);
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </Map>
    </div>
  );
};

export default MapComponent;
