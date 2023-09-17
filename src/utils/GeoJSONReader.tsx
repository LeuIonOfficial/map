export const GeoJSONReader = async () => {
  try {
    const response = await fetch("/countries.geojson");
    const geoJSONText = await response.text();
    return JSON.parse(geoJSONText);
  } catch (e) {
    console.log("error", e);
  }
};
