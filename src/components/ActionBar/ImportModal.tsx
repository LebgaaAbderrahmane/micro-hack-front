"use client";

import React, { useState } from "react";
import { X, FileUp, Clipboard, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: string) => void;
    title?: string;
    description?: string;
}

export const ImportModal = ({
    isOpen,
    onClose,
    onImport,
    title = "Import Data",
    description = "Upload a CSV file or paste your data below"
}: ImportModalProps) => {
    const [importText, setImportText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    if (!isOpen) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setImportText(text);
            };
            reader.readAsText(file);
        }
    };

    const handleProcess = async () => {
        setIsProcessing(true);
        try {
            await onImport(importText);
            setImportText("");
            onClose();
        } catch (err) {
            console.error("Import failed:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl w-full max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-foreground/5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-8 flex items-start justify-between border-b border-foreground/5">
                    <div>
                        <h2 className="text-2xl font-black font-poppins text-foreground uppercase tracking-tight">{title}</h2>
                        <p className="text-foreground/40 text-sm mt-1 font-medium">{description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
                    {/* File Upload Zone */}
                    <section>
                        <h3 className="text-[10px] font-black text-foreground/20 mb-4 uppercase tracking-widest ml-1">File Source</h3>
                        <label
                            className={cn(
                                "flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer group",
                                dragActive ? "border-primary bg-primary/5" : "border-foreground/10 bg-foreground/2 hover:bg-foreground/5"
                            )}
                            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={(e) => { e.preventDefault(); setDragActive(false); /* handle drop logic if needed */ }}
                        >
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <FileUp className="text-primary" size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-primary transition-colors">Click to upload CSV</span>
                            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </section>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-foreground/5" /></div>
                        <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest text-foreground/20 px-4 bg-white dark:bg-slate-950 w-fit mx-auto">OR ENTER MANUALLY</div>
                    </div>

                    {/* Manual Entry */}
                    <section>
                        <div className="flex items-center justify-between mb-4 ml-1">
                            <h3 className="text-[10px] font-black text-foreground/20 uppercase tracking-widest flex items-center gap-2">
                                <Clipboard size={12} /> Data Manifest
                            </h3>
                            {importText && (
                                <span className="text-[8px] font-bold text-success uppercase tracking-widest flex items-center gap-1">
                                    <Check size={10} /> Data Detected
                                </span>
                            )}
                        </div>
                        <textarea
                            className="w-full h-48 bg-foreground/2 border border-foreground/10 rounded-[2rem] p-6 font-mono text-xs focus:outline-none focus:border-primary/50 transition-all resize-none shadow-inner"
                            placeholder="Cargo_ID, Type, Weight..."
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                        />
                    </section>
                </div>

                {/* Footer */}
                <div className="px-8 py-8 bg-foreground/2 border-t border-foreground/5 flex gap-4 mt-auto">
                    <button onClick={onClose} className="flex-1 py-4 px-6 rounded-2xl border border-foreground/10 bg-white dark:bg-slate-900 font-bold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all text-[10px] uppercase tracking-widest active:scale-95">Cancel</button>
                    <button
                        onClick={handleProcess}
                        disabled={!importText || isProcessing}
                        className="flex-1 py-4 px-6 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95"
                    >
                        {isProcessing ? "Processing..." : "Commit Data"}
                    </button>
                </div>
            </div>
        </div>
    );
};
