"use client";

import React from "react";
import { DashboardHeader } from "@/components/Analytics/DashboardHeader";
import { KPICard } from "@/components/Analytics/KPICard";
import { ChartCard } from "@/components/Analytics/ChartCard";
import { BookingTrendsChart } from "@/components/Analytics/BookingTrendsChart";
import { TerminalUtilizationChart } from "@/components/Analytics/TerminalUtilizationChart";
import { AIMetricsCard } from "@/components/Analytics/AIMetricsCard";
import { AlertsFeed } from "@/components/Analytics/AlertsFeed";
import {
    Calendar,
    CheckCircle2,
    Clock,
    Truck,
    TrendingUp,
    Activity,
    QrCode,
    ArrowRight
} from "lucide-react";

import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const bookingData = [
    { name: "Jan 29", total: 45, confirmed: 38 },
    { name: "Jan 30", total: 52, confirmed: 45 },
    { name: "Jan 31", total: 48, confirmed: 42 },
    { name: "Feb 01", total: 61, confirmed: 55 },
    { name: "Feb 02", total: 55, confirmed: 50 },
    { name: "Feb 03", total: 67, confirmed: 62 },
    { name: "Feb 04", total: 72, confirmed: 68 },
];

export default function AnalyticsPage() {
    const handleExport = async (format: "png" | "csv") => {
        try {
            if (format === "csv") {
                const worksheet = XLSX.utils.json_to_sheet(bookingData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
                XLSX.writeFile(workbook, "logistics_flow_analysis.csv");
                toast.success("CSV exported successfully");
            } else {
                // For PNG, we'll simulate it for now as html2canvas is not installed
                // In a real app, we'd use html2canvas to capture the chart container
                toast.info("PNG export requires html2canvas. Downloading CSV instead.");
                const worksheet = XLSX.utils.json_to_sheet(bookingData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
                XLSX.writeFile(workbook, "logistics_flow_analysis.csv");
            }
        } catch (error) {
            toast.error("Failed to export data");
            console.error(error);
        }
    };

    const handleGenerateReport = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Predictive Intelligence Report", 14, 22);

        doc.setFontSize(12);
        doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 32);

        doc.setFontSize(14);
        doc.text("System Prediction Summary", 14, 45);

        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(
            "Based on historical data and current booking trends, our neural engine predicts a 14.2% increase in vessel handling efficiency for Terminal 2 in the next 24-hour cycle. We recommend allocating additional buffer zones in Sector 4 to accommodate the projected influx.",
            180
        );
        doc.text(splitText, 14, 55);

        autoTable(doc, {
            head: [['Date', 'Total Bookings', 'Confirmed']],
            body: bookingData.map(row => [row.name, row.total, row.confirmed]),
            startY: 75,
        });

        doc.save("predictive_report.pdf");
        toast.success("Report downloaded successfully");
    };

    return (
        <div className="flex flex-col gap-10 w-full max-w-[1080px] mx-auto py-6 min-h-screen px-6">
            <DashboardHeader />

            {/* KPI Section */}
            <section className="space-y-4 mb-4">
                <h2 className="text-content-title dark:text-foreground font-poppins font-semibold text-[22px] px-1">
                    Efficiency Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Total Bookings"
                        value="1,757"
                        change={{ value: "+12.5%", isPositive: true }}
                        icon={<Calendar />}
                        color="blue"
                        chartData={[{ v: 12 }, { v: 19 }, { v: 15 }, { v: 22 }, { v: 18 }, { v: 25 }, { v: 30 }]}
                    />
                    <KPICard
                        title="Success Rate"
                        value="94.2%"
                        change={{ value: "+2.1%", isPositive: true }}
                        icon={<CheckCircle2 />}
                        color="green"
                        chartData={[{ v: 85 }, { v: 88 }, { v: 92 }, { v: 90 }, { v: 94 }, { v: 93 }, { v: 95 }]}
                    />
                    <KPICard
                        title="Avg. Wait Time"
                        value="4.2m"
                        change={{ value: "-15.3%", isPositive: true }}
                        icon={<Clock />}
                        color="orange"
                        chartData={[{ v: 10 }, { v: 8 }, { v: 7 }, { v: 6 }, { v: 5 }, { v: 5 }, { v: 4 }]}
                    />
                    <KPICard
                        title="Digital Check-ins"
                        value="85.5%"
                        change={{ value: "+3.2%", isPositive: true }}
                        icon={<QrCode />}
                        color="purple"
                        chartData={[{ v: 70 }, { v: 75 }, { v: 72 }, { v: 80 }, { v: 82 }, { v: 84 }, { v: 86 }]}
                    />
                </div>
            </section>

            {/* Primary Analytical Section - Full Width for Maximum Detail */}
            <section className="space-y-4">
                <h2 className="text-content-title dark:text-foreground font-poppins font-semibold text-[20px] px-1">
                    Logistics Performance Trends
                </h2>
                <ChartCard
                    title="Logistics Flow Analysis"
                    subtitle="Temporal booking performance vs confirmation thresholds"
                    className="min-h-[450px]"
                    onExport={handleExport}
                >
                    <BookingTrendsChart data={bookingData} />
                </ChartCard>
            </section>

            {/* Secondary Analytical Grid - Symmetrical 50/50 Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="space-y-4">
                    <h2 className="text-content-title dark:text-foreground font-poppins font-semibold text-[20px] px-1">
                        Operational Saturation
                    </h2>
                    <ChartCard
                        title="Terminal Saturation"
                        subtitle="Live node occupancy per terminal sector"
                        className="h-[500px]"
                        hideActions
                    >
                        <TerminalUtilizationChart />
                    </ChartCard>
                </section>

                <section className="space-y-4">
                    <h2 className="text-content-title dark:text-foreground font-poppins font-semibold text-[20px] px-1">
                        Predictive AI Intelligence
                    </h2>
                    <div className="h-[500px]">
                        <AIMetricsCard />
                    </div>
                </section>
            </div>

            {/* Tertiary Row - Feed and Supplemental KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                <section className="lg:col-span-2 space-y-4">
                    <h2 className="text-content-title dark:text-foreground font-poppins font-semibold text-[20px] px-1">
                        Real-time Operational Feed
                    </h2>
                    <div className="min-h-[400px]">
                        <AlertsFeed />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-content-title dark:text-foreground font-poppins font-semibold text-[20px] px-1">
                        Supplemental Metrics
                    </h2>
                    <div className="flex flex-col gap-6">
                        <KPICard
                            title="Gate Passage Velocity"
                            value="89.3%"
                            change={{ value: "+5.1%", isPositive: true }}
                            icon={<Truck />}
                            color="green"
                            className="h-[188px]"
                        />
                        <KPICard
                            title="Active AI Sessions"
                            value="1,234"
                            change={{ value: "+8.2%", isPositive: true }}
                            icon={<Activity />}
                            color="lavender"
                            className="h-[188px]"
                        />
                    </div>
                </section>
            </div>

            {/* Bottom Projection Section - Grounding Footer Banner */}
            <section className="space-y-4 pb-10">
                <h2 className="text-content-title dark:text-foreground font-poppins font-semibold text-[20px] px-1">
                    Predictive Intelligence Report
                </h2>
                <div onClick={handleGenerateReport} className="bg-background border border-border-div p-8 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:shadow-md hover:bg-foreground/1 cursor-pointer group">
                    <div className="space-y-2 text-left w-full">
                        <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-[10px]">
                            <TrendingUp size={14} />
                            System Prediction
                        </div>
                        <h3 className="text-xl font-semibold text-foreground font-poppins">Tomorrow's Throughput Projection</h3>
                        <p className="text-sm font-normal font-poppins text-foreground/50 max-w-2xl leading-relaxed">
                            Based on historical data and current booking trends, our neural engine predicts a <span className="text-primary font-semibold">14.2% increase</span> in vessel handling efficiency for Terminal 2 in the next 24-hour cycle.
                        </p>
                    </div>
                    <button
                        className="whitespace-nowrap flex items-center gap-2 px-8 py-3 text-white rounded-lg font-semibold text-sm shadow-lg transition-all active:scale-95 group/btn"
                        style={{ background: "linear-gradient(179.91deg, rgb(107,171,255) 0.2%, rgb(75,151,251) 99.8%)" }}
                    >
                        Full Projection Report
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>
        </div>
    );
}
