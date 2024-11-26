
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", 
    style: "mapbox://styles/mapbox/streets-v12",
    center: [ 77.216721,28.644800 ],
    zoom: 9,
});
