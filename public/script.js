let map;

function initMap() {
  const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // New Delhi

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 14,
  });

  fetch(`http://localhost:5000/cafes?lat=${center.lat}&lng=${center.lng}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.results) {
        data.results.forEach((place) => {
          if (place.geometry && place.geometry.location) {
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map,
              title: place.name,
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `<h3>${place.name}</h3>
                        <p>Rating: ${place.rating || "N/A"}</p>
                        <p>${place.vicinity || ""}</p>`,
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });
          }
        });
      }
    })
    .catch((err) => console.error("Error fetching cafes:", err));
}