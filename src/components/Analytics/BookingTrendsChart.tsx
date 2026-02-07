"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const defaultData = [
    { name: "Jan 29", total: 45, confirmed: 38 },
    { name: "Jan 30", total: 52, confirmed: 45 },
    { name: "Jan 31", total: 48, confirmed: 42 },
    { name: "Feb 01", total: 61, confirmed: 55 },
    { name: "Feb 02", total: 55, confirmed: 50 },
    { name: "Feb 03", total: 67, confirmed: 62 },
    { name: "Feb 04", total: 72, confirmed: 68 },
];

export const BookingTrendsChart = ({ data }: { data?: any[] }) => {
    const chartData = data || defaultData;
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={chartData}
                margin={{
                    top: 10,
                    right: 5,
                    left: -20,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4b97fb" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#4b97fb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#71dd8c" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#71dd8c" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                    domain={[0, 80]}
                    ticks={[0, 20, 40, 60, 80]}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{ fontSize: "12px", fontWeight: 600 }}
                />
                <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{
                        paddingBottom: "25px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#4b97fb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    name="Total Bookings"
                    animationDuration={1500}
                />
                <Area
                    type="monotone"
                    dataKey="confirmed"
                    stroke="#71dd8c"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorConfirmed)"
                    name="Confirmed Bookings"
                    animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
