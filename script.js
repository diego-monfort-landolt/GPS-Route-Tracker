let map;
let path = [];
let watchId;
let polyline;

function initMap() {
    map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    polyline = L.polyline([], { color: 'red' }).addTo(map);
}

function updateMap() {
    const latlngs = path.map(p => [p.latitude, p.longitude]);
    L.polyline(latlngs, { color: 'red' }).addTo(map);
    map.setView(latlngs[latlngs.length - 1], 15);
}

document.getElementById('startButton').addEventListener('click', () => {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(position => {
          const { latitude, longitude } = position.coords;
          path.push({ latitude, longitude });
          L.marker([latitude, longitude]).addTo(map);
          updateMap();
      }, error => {
          console.error(error);
      }, {
          enableHighAccuracy: true,
          maximumAge: 0, // Ensure no caching
          timeout: 5000
      });
  } else {
      alert('Geolocation is not supported by this browser.');
  }
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        alert('Das Tracking wurde gestoppt.');
    }
});

initMap();