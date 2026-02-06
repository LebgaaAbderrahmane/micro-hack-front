"use client";

import React, { useState } from "react";
import { X, FileText, Table, FileSpreadsheet, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { bookingAuditLogsService } from "@/services/system.service";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any; // Context/Filters
}

type ExportFormat = "pdf" | "csv" | "excel";

export const ExportModal = ({ isOpen, onClose, data }: ExportModalProps) => {
    const [format, setFormat] = useState<ExportFormat>("pdf");
    const [includeFilters, setIncludeFilters] = useState(true);
    const [includeDateRange, setIncludeDateRange] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const formats = [
        {
            id: "pdf" as ExportFormat,
            title: "PDF Document",
            desc: "Export as a formatted PDF report",
            icon: <FileText className="text-blue-500" size={24} />,
        },
        {
            id: "csv" as ExportFormat,
            title: "CSV File",
            desc: "Export as comma-separated values",
            icon: <Table className="text-gray-500" size={24} />,
        },
        {
            id: "excel" as ExportFormat,
            title: "Excel Spreadsheet",
            desc: "Export as Microsoft Excel file",
            icon: <FileSpreadsheet className="text-green-600" size={24} />,
        },
    ];

    const today = new Date().toISOString().split('T')[0];
    const previewFilename = `logs_export_${today}.${format === 'excel' ? 'xlsx' : format}`;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Fetch filtered data specifically for export
            const { data: logs, error } = await bookingAuditLogsService.getLogsWithUsers(data);

            if (error) throw error;

            const headers = ['ID', 'User', 'Action', 'Reason', 'Timestamp'];
            const rows = logs?.map(log => [
                log.id,
                log.users?.username || 'System',
                log.action_type,
                log.change_reason || '',
                log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'
            ]);

            if (format === 'csv') {
                const csvContent = [headers, ...(rows || [])].map(e => e.join(",")).join("\n");
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", previewFilename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (format === 'pdf') {
                const doc = new jsPDF();

                // Add title
                doc.setFontSize(18);
                doc.text("Activity Logs Report", 14, 22);
                doc.setFontSize(11);
                doc.setTextColor(100);

                // Add generation date
                doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

                // Add filters info if requested
                if (includeFilters && data) {
                    let filterText = "Filters applied: ";
                    if (data.search) filterText += `Search: "${data.search}" `;
                    if (data.fromDate) filterText += `From: ${data.fromDate} `;
                    if (data.toDate) filterText += `To: ${data.toDate} `;
                    doc.text(filterText, 14, 38);
                }

                autoTable(doc, {
                    head: [headers],
                    body: rows || [],
                    startY: includeFilters ? 45 : 35,
                    theme: 'striped',
                    headStyles: { fillColor: [59, 130, 246] }, // primary blue
                    styles: { fontSize: 8 }
                });

                doc.save(previewFilename);
            } else if (format === 'excel') {
                const worksheet = XLSX.utils.aoa_to_sheet([headers, ...(rows || [])]);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

                // For excel, we might want to add another sheet with filters or a header row
                XLSX.writeFile(workbook, previewFilename);
            }

            onClose();
        } catch (err) {
            console.error("Export failed:", err);
            alert("Export failed. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 flex items-start justify-between border-b border-gray-50">
                    <div>
                        <h2 className="text-2xl font-bold font-poppins text-[#1a1c21]">Export Logs</h2>
                        <p className="text-content-title text-sm mt-1">Choose your export format and options</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={24} className="text-content-title" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
                    {/* Format Selection */}
                    <section>
                        <h3 className="text-sm font-semibold text-[#1a1c21] mb-4 uppercase tracking-wider">Export Format</h3>
                        <div className="space-y-3">
                            {formats.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setFormat(f.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group",
                                        format === f.id ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                                    )}
                                >
                                    <div className="p-2 bg-white rounded-lg shadow-sm">{f.icon}</div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-[#1a1c21] font-poppins">{f.title}</p>
                                        <p className="text-xs text-content-title">{f.desc}</p>
                                    </div>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                        format === f.id ? "bg-primary text-white" : "border-2 border-gray-100"
                                    )}>
                                        {format === f.id && <Check size={14} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Options */}
                    <section>
                        <h3 className="text-sm font-semibold text-[#1a1c21] mb-4 uppercase tracking-wider">Export Options</h3>
                        <div className="space-y-4">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <input type="checkbox" className="sr-only" checked={includeFilters} onChange={() => setIncludeFilters(!includeFilters)} />
                                <div className={cn("w-5 h-5 mt-1 rounded border-2 flex items-center justify-center transition-all", includeFilters ? "bg-primary border-primary" : "border-gray-300 group-hover:border-primary")}>
                                    {includeFilters && <Check size={14} className="text-white" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1a1c21]">Include Applied Filters</p>
                                    <p className="text-xs text-content-title">Export only the filtered results</p>
                                </div>
                            </label>
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <input type="checkbox" className="sr-only" checked={includeDateRange} onChange={() => setIncludeDateRange(!includeDateRange)} />
                                <div className={cn("w-5 h-5 mt-1 rounded border-2 flex items-center justify-center transition-all", includeDateRange ? "bg-primary border-primary" : "border-gray-300 group-hover:border-primary")}>
                                    {includeDateRange && <Check size={14} className="text-white" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1a1c21]">Include Date Range</p>
                                    <p className="text-xs text-content-title">Show date range in the exported file</p>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <p className="text-[10px] font-bold text-content-title uppercase tracking-widest mb-2">File Preview</p>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FileText className="text-gray-400" size={18} />
                            </div>
                            <span className="text-sm font-medium text-[#1a1c21] truncate">{previewFilename}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex gap-4 mt-auto">
                    <button onClick={onClose} className="flex-1 py-3 px-6 rounded-xl border border-gray-200 bg-white font-semibold text-[#1a1c21] hover:bg-gray-50 transition-all text-sm">Cancel</button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all text-sm shadow-lg shadow-primary/20 disabled:opacity-50"
                        style={{ background: "#3b82f6" }}
                    >
                        {isExporting ? "Exporting..." : "Export"}
                    </button>
                </div>
            </div>
        </div>
    );
};
