
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", 
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9,
});

console.log(coordinates)

const marker = new mapboxgl.Marker({color: 'Red'})
.setLngLat(coordinates)
.addTo(map);