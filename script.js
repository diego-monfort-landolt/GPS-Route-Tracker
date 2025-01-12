let map; // Variable für die Karte
let path = []; // Array zur Speicherung des Pfads
let watchId; // ID für die Geolocation-Überwachung
let polyline; // Variable für die Polyline

// Funktion zur Initialisierung der Karte
function initMap() {
    map = L.map('map').setView([0, 0], 2); // Karte mit Standardansicht erstellen

    // OpenStreetMap-Kacheln hinzufügen
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Polyline zur Karte hinzufügen
    polyline = L.polyline([], { color: 'red' }).addTo(map);
}

// Funktion zur Aktualisierung der Karte
function updateMap() {
    const latlngs = path.map(p => [p.latitude, p.longitude]); // Pfad in LatLng-Array umwandeln
    L.polyline(latlngs, { color: 'red' }).addTo(map); // Polyline zur Karte hinzufügen
    map.setView(latlngs[latlngs.length - 1], 15); // Karte auf den letzten Punkt zentrieren
}

// Event-Listener für den Start-Button
document.getElementById('startButton').addEventListener('click', () => {
    if (navigator.geolocation) {
        // Geolocation-Überwachung starten
        watchId = navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            path.push({ latitude, longitude }); // Position zum Pfad hinzufügen
            L.marker([latitude, longitude]).addTo(map); // Marker zur Karte hinzufügen
            updateMap(); // Karte aktualisieren
        }, error => {
            console.error(error); // Fehlerbehandlung
        }, {
            enableHighAccuracy: true,
            maximumAge: 0, // Kein Caching
            timeout: 5000 // Timeout von 5 Sekunden
        });
    } else {
        alert('Geolocation is not supported by this browser.'); // Fehlermeldung, wenn Geolocation nicht unterstützt wird
    }
});

// Event-Listener für den Stop-Button
document.getElementById('stopButton').addEventListener('click', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId); // Geolocation-Überwachung stoppen
        watchId = null; // watchId zurücksetzen
        alert('Das Tracking wurde gestoppt.'); // Benachrichtigung anzeigen
    }
});

// Karte initialisieren
initMap();
