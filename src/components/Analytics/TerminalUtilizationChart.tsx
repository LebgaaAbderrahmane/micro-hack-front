"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from "recharts";

const data = [
    { name: "Terminal 1", used: 65, available: 35 },
    { name: "Terminal 2", used: 82, available: 18 },
    { name: "Terminal 3", used: 45, available: 55 },
    { name: "Terminal 4", used: 91, available: 9 },
];

export const TerminalUtilizationChart = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical"
                data={data}
                margin={{
                    top: 20,
                    right: 40,
                    left: 20,
                    bottom: 20,
                }}
                barSize={10}
            >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    unit="%"
                />
                <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#1e293b", fontSize: 12, fontWeight: 600 }}
                    width={85}
                />
                <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.02)" }}
                    contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number | undefined) => [value !== undefined ? `${value}%` : "0%", ""]}
                />
                <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="square"
                    wrapperStyle={{
                        paddingBottom: "25px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                />
                <Bar dataKey="used" stackId="a" radius={[0, 0, 0, 0]} name="Used %">
                    {data.map((entry, index) => {
                        let color = "#71dd8c"; // Green < 70%
                        if (entry.used > 90) color = "#ff5252"; // Red > 90%
                        else if (entry.used >= 70) color = "#ffb74d"; // Orange 70-90%
                        return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                </Bar>
                <Bar dataKey="available" stackId="a" fill="#a5a5a5" radius={[0, 4, 4, 0]} name="Available %" />
            </BarChart>
        </ResponsiveContainer>
    );
};
