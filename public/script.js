let map;

function initMap() {
  const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // New Delhi

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 14,
  });
}
