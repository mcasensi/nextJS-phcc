"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Church {
    id: number;
    name: string;
    city: string;
    lat: number;
    lng: number;
}

export default function LeafletMap({ churches }: { churches: Church[] }) {
    return (
        <div
            style={{
                height: "400px",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                zIndex: 0,
                isolation: "isolate",
            }}
        >
            <MapContainer
                center={[12.8797, 121.774]}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {churches.map((church) => (
                    <Marker key={church.id} position={[church.lat, church.lng]}>
                        <Popup>
                            <strong>{church.name}</strong>
                            <br />
                            {church.city}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
