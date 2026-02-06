"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

// Dynamic imports for Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockData = {
  terminals: [
    { id: 1, name: "Terminal North", pos: [51.505, -0.09] as [number, number], capacity: 92, color: "#EF4444" },
    { id: 2, name: "Terminal South", pos: [51.51, -0.1] as [number, number], capacity: 45, color: "#3B82F6" },
    { id: 3, name: "Terminal West", pos: [51.49, -0.08] as [number, number], capacity: 78, color: "#FBBF24" },
  ],
  gates: [
    { id: "G1", name: "North Gate A", pos: [51.508, -0.085] as [number, number], status: "ACTIVE" },
    { id: "G2", name: "North Gate B", pos: [51.5075, -0.086] as [number, number], status: "MAINTENANCE" },
    { id: "G3", name: "South Gate Main", pos: [51.502, -0.095] as [number, number], status: "BUSY" },
  ],
  lanes: [
    { id: "L1", gateId: "G1", pos: [51.5081, -0.084] as [number, number] }, 
    { id: "L2", gateId: "G1", pos: [51.5079, -0.086] as [number, number] }, 
  ],
  paths: [
    // Entry to Terminal North
    { id: "P1", points: [[51.508, -0.085], [51.506, -0.088], [51.505, -0.09]] as [number, number][], type: "ENTRY", color: "#10b981" },
    // Entry to Terminal South
    { id: "P2", points: [[51.502, -0.095], [51.506, -0.098], [51.51, -0.1]] as [number, number][], type: "ENTRY", color: "#10b981" },
     // Exits
    { id: "P3", points: [[51.505, -0.09], [51.504, -0.082], [51.502, -0.095]] as [number, number][], type: "EXIT", color: "#f59e0b" },
  ],
  links: [
    { from: [51.508, -0.085] as [number, number], to: [51.505, -0.09] as [number, number], dashed: true },
    { from: [51.502, -0.095] as [number, number], to: [51.51, -0.1] as [number, number], dashed: true },
  ]
};

interface PortMapProps {
  mode?: "ADMIN" | "OPERATOR" | "VIEW";
}

const PortMap: React.FC<PortMapProps> = ({ mode = "VIEW" }) => {
    const { theme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);
    const [L, setL] = useState<typeof import("leaflet") | null>(null);

    // Admin state
    const [showGates, setShowGates] = useState(true);
    const [showTerminals, setShowTerminals] = useState(true);
    const [showLanes, setShowLanes] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        import("leaflet").then((leaflet) => {
            setL(leaflet);
        });
    }, []);

    if (!isMounted || !L) {
        return (
            <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
                <p className="text-gray-400 font-medium text-xs tracking-widest">LOADING PORT MAP...</p>
            </div>
        );
    }

    // Default icon fix
    const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const GateIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #f59e0b; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    const LaneIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #6366f1; width: 8px; height: 8px; border-radius: 2px;"></div>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4]
    });

    return (
        <div className="w-full h-full min-h-[500px] relative rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
            
            {/* Admin Controls Overlay */}
            {mode === "ADMIN" && (
                <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-black/90 backdrop-blur p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 min-w-[200px]">
                    <h4 className="font-bold text-sm mb-3">Map Layers</h4>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="show-terminals" checked={showTerminals} onCheckedChange={(c) => setShowTerminals(!!c)} />
                            <Label htmlFor="show-terminals">Terminals & Zones</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="show-gates" checked={showGates} onCheckedChange={(c) => setShowGates(!!c)} />
                            <Label htmlFor="show-gates">Entry Gates</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="show-lanes" checked={showLanes} onCheckedChange={(c) => setShowLanes(!!c)} />
                            <Label htmlFor="show-lanes">Gate Lanes</Label>
                        </div>
                    </div>
                </div>
            )}

            <MapContainer
                center={[51.505, -0.09]}
                zoom={14}
                style={{ height: "100%", width: "100%", background: theme === "dark" ? "#111827" : "#f8fafc" }}
            >
                <TileLayer
                    attribution='&copy; CARTO'
                    url={theme === "dark" 
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    }
                />

                {/* Terminals Layer */}
                {(mode === "OPERATOR" || (mode === "ADMIN" && showTerminals)) && mockData.terminals.map((t) => (
                    <React.Fragment key={`term-${t.id}`}>
                         <Circle
                            center={t.pos}
                            pathOptions={{ fillColor: t.color, color: t.color, weight: 1, opacity: 0.8, fillOpacity: 0.2 }}
                            radius={400}
                        >
                             <Popup>
                                <div className="p-1">
                                    <strong className="text-sm">{t.name}</strong><br/>
                                    <span className="text-xs">Capacity: {t.capacity}%</span>
                                </div>
                            </Popup>
                        </Circle>
                        <Marker position={t.pos} icon={DefaultIcon}>
                        </Marker>
                    </React.Fragment>
                ))}

                {/* Gates Layer */}
                {(mode === "OPERATOR" || (mode === "ADMIN" && showGates)) && mockData.gates.map((g) => (
                     <Marker key={`gate-${g.id}`} position={g.pos} icon={GateIcon}>
                        <Popup>
                            <strong>{g.name}</strong><br/>
                            Status: {g.status}
                        </Popup>
                    </Marker>
                ))}

                 {/* Lanes Layer */}
                 {(mode === "ADMIN" && showLanes) && mockData.lanes.map((l) => (
                     <Marker key={`lane-${l.id}`} position={l.pos} icon={LaneIcon}>
                        <Popup>Lane {l.id}</Popup>
                    </Marker>
                ))}

                {/* Operator Specific: Circulation & Links */}
                {mode === "OPERATOR" && (
                    <>
                        {/* Truck Circulation Paths */}
                        {mockData.paths.map((p) => (
                             <Polyline 
                                key={`path-${p.id}`} 
                                positions={p.points} 
                                pathOptions={{ color: p.color, weight: 4, opacity: 0.6, dashArray: p.type === 'EXIT' ? '5, 10' : undefined }} 
                            />
                        ))}

                        {/* Gate <-> Terminal Links */}
                        {mockData.links.map((l, i) => (
                             <Polyline 
                                key={`link-${i}`} 
                                positions={[l.from, l.to]} 
                                pathOptions={{ color: '#ffffff', weight: 1, opacity: 0.3, dashArray: '4, 4' }} 
                            />
                        ))}
                    </>
                )}
            </MapContainer>
        </div>
    );
};

export default PortMap;
