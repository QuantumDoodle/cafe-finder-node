let map;
let markers = [];

function initMap() {
  const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // Default: New York

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false,
  });

  // Get user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(userLocation);

        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "You are here",
          icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        fetchCafes(userLocation.lat, userLocation.lng);
      },
      () => {
        console.log("Geolocation failed. Using default location.");
        fetchCafes(defaultLocation.lat, defaultLocation.lng);
      }
    );
  } else {
    console.log("Geolocation not supported. Using default location.");
    fetchCafes(defaultLocation.lat, defaultLocation.lng);
  }
}

// Fetch cafes from backend
async function fetchCafes(lat, lng) {
  try {
    const response = await fetch(`/cafes?lat=${lat}&lng=${lng}`);
    const data = await response.json();
    displayCafes(data.results);
  } catch (error) {
    console.error("Error fetching cafes:", error);
  }
}

// Display cafes: markers + sidebar
function displayCafes(cafes) {
  const sidebar = document.getElementById("sidebar") || createSidebar();
  sidebar.innerHTML = ""; // Clear previous

  // Remove old markers
  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  cafes.forEach((cafe, index) => {
    const { name, geometry, vicinity } = cafe;
    const position = {
      lat: geometry.location.lat,
      lng: geometry.location.lng,
    };

    // Create marker
    const marker = new google.maps.Marker({
      position,
      map,
      title: name,
    });

    // Info window
    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${name}</h3><p>${vicinity}</p>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    markers.push(marker);

    // Sidebar item
    const item = document.createElement("div");
    item.className = "sidebar-item";
    item.innerHTML = `<strong>${name}</strong><p>${vicinity}</p>`;
    item.addEventListener("click", () => {
      map.panTo(position);
      map.setZoom(16);
      infoWindow.open(map, marker);
    });
    sidebar.appendChild(item);
  });
}

// Create sidebar if not exists
function createSidebar() {
  const sidebar = document.createElement("div");
  sidebar.id = "sidebar";
  sidebar.style.width = "300px";
  sidebar.style.height = "100%";
  sidebar.style.overflowY = "auto";
  sidebar.style.position = "absolute";
  sidebar.style.top = "0";
  sidebar.style.right = "0";
  sidebar.style.backgroundColor = "rgba(255,255,255,0.95)";
  sidebar.style.padding = "10px";
  sidebar.style.boxShadow = "-2px 0 5px rgba(0,0,0,0.2)";
  document.body.appendChild(sidebar);
  return sidebar;
}
