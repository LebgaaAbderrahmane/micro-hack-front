"use client";

import React from "react";
import { motion } from "framer-motion";

const TerminalYard = () => {
    const lanes = [1, 2, 3, 4, 5];
    const trucks = [
        { id: 1, lane: 1, pos: 20, color: "#3B82F6", status: "checking-in" },
        { id: 2, lane: 2, pos: 60, color: "#0EA5E9", status: "loading" },
        { id: 3, lane: 3, pos: 10, color: "#F59E0B", status: "moving" },
        { id: 4, lane: 5, pos: 85, color: "#EF4444", status: "issue" },
    ];

    return (
        <div className="w-full h-full min-h-[400px] bg-neutral-900 rounded-2xl p-8 relative overflow-hidden border border-foreground/10 shadow-inner">
            {/* Yard Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-12 px-20">
                {lanes.map((lane) => (
                    <div key={lane} className="h-20 border-y border-dashed border-foreground/10 flex items-center relative">
                        <span className="absolute -left-12 text-[10px] font-bold text-foreground/20 uppercase tracking-widest">
                            Lane 0{lane}
                        </span>
                        <div className="w-full h-[1px] bg-foreground/5"></div>
                        {/* Gate Area */}
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-primary/5 border-l border-primary/20 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-primary/40 rotate-90 uppercase tracking-[0.2em]">Gate 0{lane}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Animated Trucks */}
            <div className="absolute inset-0 py-12 px-20">
                {trucks.map((truck) => (
                    <motion.div
                        key={truck.id}
                        initial={{ left: `${truck.pos}%` }}
                        animate={{
                            left: truck.status === "moving" ? ["10%", "40%", "10%"] : `${truck.pos}%`,
                            scale: truck.status === "issue" ? [1, 1.05, 1] : 1
                        }}
                        transition={{
                            duration: truck.status === "moving" ? 10 : 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute h-12 w-20 rounded-lg flex flex-col items-center justify-center shadow-lg cursor-pointer group"
                        style={{
                            top: `${(truck.lane - 0.5) * 20}%`,
                            marginTop: "-24px",
                            backgroundColor: `${truck.color}20`,
                            border: `1px solid ${truck.color}40`
                        }}
                    >
                        <div className={`w-8 h-4 rounded-sm mb-1 transition-colors duration-500`} style={{ backgroundColor: truck.color }}></div>
                        <span className="text-[8px] font-bold text-white/70 group-hover:text-white">TRK-{truck.id}0{truck.lane}</span>

                        {/* Status Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded text-[8px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-white">
                            {truck.status}
                        </div>

                        {/* Pulse effect for issues */}
                        {truck.status === "issue" && (
                            <div className="absolute inset-0 rounded-lg animate-ping bg-error/20 -z-10"></div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
        </div>
    );
};

export default TerminalYard;
