"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });

const PortMap = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [L, setL] = useState<typeof import("leaflet") | null>(null);

    useEffect(() => {
        setIsMounted(true);
        // Import leaflet directly for icon configuration
        import("leaflet").then((leaflet) => {
            setL(leaflet);
        });
    }, []);

    if (!isMounted || !L) {
        return (
            <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-foreground/5 rounded-2xl animate-pulse">
                <p className="text-foreground/30 font-medium tracking-widest">MAP ENGINE SYNCHRONIZING...</p>
            </div>
        );
    }

    // Fixing default icon issue in Leaflet + Next.js
    const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const terminals = [
        { id: 1, name: "Terminal North", pos: [51.505, -0.09] as [number, number], capacity: 92, color: "#EF4444" },
        { id: 2, name: "Terminal South", pos: [51.51, -0.1] as [number, number], capacity: 45, color: "#3B82F6" },
        { id: 3, name: "Terminal West", pos: [51.49, -0.08] as [number, number], capacity: 78, color: "#FBBF24" },
    ];

    return (
        <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-foreground/10 shadow-2xl z-0">
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: "100%", width: "100%", background: "#111827" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {terminals.map((terminal) => (
                    <React.Fragment key={terminal.id}>
                        <Marker position={terminal.pos} icon={defaultIcon}>
                            <Popup className="custom-popup">
                                <div className="p-2">
                                    <h4 className="font-bold text-gray-900">{terminal.name}</h4>
                                    <p className="text-sm text-gray-600">Capacity: {terminal.capacity}%</p>
                                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
                                        <div
                                            className="h-full rounded-full"
                                            style={{ width: `${terminal.capacity}%`, backgroundColor: terminal.color }}
                                        ></div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                        <Circle
                            center={terminal.pos}
                            pathOptions={{ fillColor: terminal.color, color: terminal.color, weight: 1, opacity: 0.3, fillOpacity: 0.15 }}
                            radius={800}
                        />
                    </React.Fragment>
                ))}
            </MapContainer>
        </div>
    );
};

export default PortMap;
