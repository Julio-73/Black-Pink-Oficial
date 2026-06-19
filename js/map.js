// Tour map (Leaflet) — uses global L loaded from CDN
const CITIES = [
    { name: 'Seoul, South Korea',    lat: 37.5665,  lng: 126.978,  desc: 'Oct 15-16, 2022 (50K BLINKs)' },
    { name: 'Bangkok, Thailand',     lat: 13.7563,  lng: 100.5018, desc: 'Jan 7-8, 2023' },
    { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278,  desc: 'Dec 1, 2022' },
    { name: 'Sydney, Australia',     lat: -33.8688, lng: 151.2093, desc: 'Jun 10-11, 2023' },
    { name: 'Paris, France',         lat: 48.8566,  lng: 2.3522,   desc: 'Dec 11-12, 2022' },
    { name: 'Atlanta, USA',          lat: 33.749,   lng: -84.388,  desc: 'Nov 2-3, 2022' }
];

let _mapInstance = null;

export function init() {
    const mapContainer = document.getElementById('tour-map-leaflet');
    if (!mapContainer || typeof L === 'undefined') return;

    _mapInstance = L.map('tour-map-leaflet').setView([22, 40], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 18
    }).addTo(_mapInstance);

    const radarHeartIcon = L.divIcon({
        className: 'leaflet-radar-marker',
        html: `
            <div class="radar-heart-wrapper">
                <div class="radar-pulse-ring"></div>
                <i class="bx bxs-heart radar-heart-icon"></i>
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const seoulLatLng = [37.5665, 126.978];

    for (const city of CITIES) {
        const marker = L.marker([city.lat, city.lng], { icon: radarHeartIcon }).addTo(_mapInstance);
        marker.bindPopup(
            `<strong style="color:#ff6b9d; font-family:'Outfit', sans-serif;">${city.name}</strong>` +
            `<br><span style="font-size:0.8rem; color:#aaa;">${city.desc}</span>` +
            `<br><button class="btn-small" style="margin-top:8px; display:inline-block; font-size:0.7rem; padding:0.3rem 0.6rem; background:#ff6b9d; color:#000; border-radius:4px; font-weight:600; cursor:pointer;" data-action="open-booking" data-city="${city.name}" data-date="${city.desc}">Reservar Entrada</button>`
        );

        if (city.name !== 'Seoul, South Korea') {
            L.polyline([seoulLatLng, [city.lat, city.lng]], {
                color: '#ff6b9d',
                weight: 2,
                opacity: 0.6,
                className: 'leaflet-flight-path'
            }).addTo(_mapInstance);
        }
    }
}

export function destroy() {
    if (_mapInstance) { _mapInstance.remove(); _mapInstance = null; }
}
