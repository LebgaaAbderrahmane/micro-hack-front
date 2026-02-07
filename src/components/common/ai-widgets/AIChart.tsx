"use client";

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ChartComponent } from "@/types/ai-components";

interface AIChartProps {
  component: ChartComponent;
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "#4b97fb",
  "#71dd8c",
  "#ffb74d",
  "#9f9ff8",
  "#f23e3e",
  "#2dd4bf",
  "#f472b6",
];

const PIE_COLORS = [
  "#4b97fb",
  "#71dd8c",
  "#ffb74d",
  "#9f9ff8",
  "#f23e3e",
  "#2dd4bf",
  "#f472b6",
  "#facc15",
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background/90 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 shadow-xl text-[11px]">
      {label && (
        <p className="text-muted-foreground font-medium mb-1">{label}</p>
      )}
      {payload.map((p, i) => (
        <p key={i} className="text-foreground font-bold">
          {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export const AIChart: React.FC<AIChartProps> = ({ component }) => {
  const { title, chart_type, data, x_axis_label, y_axis_label } = component;

  if (!data.length) return null;

  const chartData = data.map((d) => ({
    name: d.label,
    value: d.value,
    category: d.category,
  }));

  const renderChart = () => {
    const axisProps = {
      tick: { fontSize: 10, fill: "hsl(var(--muted-foreground))" },
      axisLine: { stroke: "hsl(var(--border))", strokeOpacity: 0.3 },
      tickLine: false,
    };

    switch (chart_type) {
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.15}
            />
            <XAxis
              dataKey="name"
              {...axisProps}
              label={
                x_axis_label
                  ? {
                      value: x_axis_label,
                      position: "insideBottom",
                      offset: -5,
                      fontSize: 10,
                    }
                  : undefined
              }
            />
            <YAxis
              {...axisProps}
              label={
                y_axis_label
                  ? {
                      value: y_axis_label,
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 10,
                    }
                  : undefined
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.15}
            />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS[0]}
              strokeWidth={2.5}
              dot={{ r: 3, fill: CHART_COLORS[0] }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="aiChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS[0]}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS[0]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.15}
            />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              fill="url(#aiChartGrad)"
            />
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="75%"
              innerRadius="45%"
              paddingAngle={3}
              strokeWidth={0}
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {title && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
          {title}
        </p>
      )}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <ResponsiveContainer width="100%" height={220}>
          {renderChart() ?? <></>}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
