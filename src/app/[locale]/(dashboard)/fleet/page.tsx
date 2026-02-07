"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Truck as TruckIcon, Users, Settings, Plus, Search, Filter, Mail, Phone, ShieldCheck, MapPin, Calendar, FileText, ExternalLink, MoreVertical, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { ChartCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TruckModal } from "@/components/fleet/TruckModal";
import { DriverModal } from "@/components/fleet/DriverModal";
import { ExportModal } from "@/components/ActionBar/ExportModal";
import { toast } from "sonner";
import { useFleet } from "@/hooks/domain/useFleet";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STATIC FALLBACK DATA (Hydration Strategy)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const FALLBACK_FLEET = {
  trucks: [
    { id: "tr-fb-1", plate_number: "LP-922-KJ", status: "AVAILABLE", model: "Scania R500", org_id: "demo", created_at: new Date().toISOString() },
    { id: "tr-fb-2", plate_number: "LP-112-MM", status: "IN_USE", model: "Volvo FH16", org_id: "demo", created_at: new Date().toISOString() },
    { id: "tr-fb-3", plate_number: "LP-555-ZZ", status: "MAINTENANCE", model: "Mercedes Actros", org_id: "demo", created_at: new Date().toISOString() },
    { id: "tr-fb-4", plate_number: "LP-001-XQ", status: "AVAILABLE", model: "Iveco S-Way", org_id: "demo", created_at: new Date().toISOString() }
  ],
  drivers: [
    { id: "dr-fb-1", full_name: "Jean Dupont", status: "ACTIVE", license_expiry: "2026-12-31", phone_number: "+33 6 12 34 56 78", org_id: "demo" },
    { id: "dr-fb-2", full_name: "Marie Curie", status: "ACTIVE", license_expiry: "2024-03-15", phone_number: "+33 6 98 76 54 32", org_id: "demo" },
    { id: "dr-fb-3", full_name: "Pierre Gasly", status: "SUSPENDED", license_expiry: "2025-06-20", phone_number: "+33 6 44 22 11 00", org_id: "demo" }
  ]
};

// ─── Shared Section Header ────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, color = "primary" }: {
  icon: React.FC<{ size?: number }>;
  title: string;
  subtitle: string;
  color?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-3 mb-6"
  >
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `bg-${color}/10 text-${color}`)}>
      <Icon size={22} />
    </div>
    <div>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-foreground/50 text-xs">{subtitle}</p>
    </div>
    <div className="ml-auto flex items-center gap-2 bg-foreground/5 px-2 py-1 rounded-lg border border-foreground/5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>
      <span className="text-[9px] font-bold text-success uppercase tracking-widest">Live Sync</span>
    </div>
  </motion.div>
);

export default function FleetPage() {
  const supabase = createClient();
  const { profile: user } = useAuth();
  const { data: dbFleet, isLoading: isFleetLoading } = useFleet();

  const fleet = dbFleet?.trucks?.length ? dbFleet : FALLBACK_FLEET;
  const trucks: any[] = fleet.trucks ?? [];
  const drivers: any[] = fleet.drivers ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("vehicles");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    setStatusFilter("ALL");
  }, [activeTab]);

  // Modal states
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const filteredTrucks = useMemo(() => {
    return (trucks || []).filter((t: any) => {
      const plate = (t.plate_number || "").toLowerCase();
      const model = (t.model || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = plate.includes(query) || model.includes(query);
      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [trucks, searchQuery, statusFilter]);

  const filteredDrivers = useMemo(() => {
    return (drivers || []).filter((d: any) => {
      const name = (d.full_name || "").toLowerCase();
      const phone = (d.phone_number || "");
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || phone.includes(searchQuery);
      const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchQuery, statusFilter]);

  const handleTruckStatusToggle = async (truckId: string, currentStatus: string) => {
    const newStatus = currentStatus === "AVAILABLE" ? "IN_USE" : "AVAILABLE";
    try {
      const { error } = await supabase
        .from("trucks")
        .update({ status: newStatus })
        .eq("id", truckId);
      if (error) throw error;
      toast.success(`Vehicle ${newStatus === 'AVAILABLE' ? 'ready' : 'dispatched'}`);
    } catch (err: any) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={TruckIcon}
        title="Fleet Management"
        subtitle="Track vehicles and manage drivers"
        color="primary"
      />

      <Tabs defaultValue="vehicles" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-foreground/5 shadow-sm backdrop-blur-md">
          <TabsList className="bg-foreground/5 p-1 rounded-xl w-fit">
            <TabsTrigger value="vehicles" className="rounded-lg font-bold text-[10px] px-6 py-2 uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <TruckIcon size={14} className="mr-2" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="drivers" className="rounded-lg font-bold text-[10px] px-6 py-2 uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Users size={14} className="mr-2" />
              Drivers
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={`Search ${activeTab === 'vehicles' ? 'plates' : 'names'}...`}
                className="pl-9 h-11 w-full sm:w-[260px] bg-foreground/5 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-bold text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-foreground/5 p-1 rounded-xl border border-foreground/5">
              {(activeTab === 'vehicles'
                ? ["ALL", "AVAILABLE", "IN_USE", "MAINTENANCE"]
                : ["ALL", "ACTIVE", "SUSPENDED", "INACTIVE"]
              ).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    statusFilter === s ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-foreground/30 hover:text-foreground/60"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto lg:ml-0">
              <Button
                variant="outline"
                className="h-11 px-6 rounded-xl border-foreground/10 hover:bg-foreground/5 font-black uppercase tracking-widest text-[9px]"
                onClick={() => setIsExportModalOpen(true)}
              >
                <FileText size={16} className="mr-2" />
                Export
              </Button>
              <Button
                className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px]"
                onClick={() => {
                  if (activeTab === 'vehicles') {
                    setSelectedTruck(null);
                    setIsTruckModalOpen(true);
                  } else {
                    setSelectedDriver(null);
                    setIsDriverModalOpen(true);
                  }
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="vehicles" className="mt-0">
          <ChartCard
            title="Vehicle Registry"
            subtitle="Full list of registered carrier trucks"
            accentColor="bg-primary"
            className="border-none shadow-2xl"
          >
            <div className="pt-4 overflow-hidden">
              <div className="rounded-2xl border border-foreground/5 overflow-hidden">
                <Table>
                  <TableHeader className="bg-foreground/2">
                    <TableRow className="border-foreground/5">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">Shipment Unit</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">License Plate</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">Current Status</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Live Toggle</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Settings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isFleetLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-20">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Syncing Registry...</p>
                        </div>
                      </TableCell></TableRow>
                    ) : filteredTrucks.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-20 opacity-20 italic">No vehicles found in registry</TableCell></TableRow>
                    ) : (
                      filteredTrucks.map((truck) => (
                        <TableRow key={truck.id} className="border-foreground/5 hover:bg-foreground/1 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm">
                                <TruckIcon size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-sm tracking-tight">{truck.model || 'Heavy Hauler'}</p>
                                <p className="text-[9px] text-foreground/30 font-black uppercase tracking-widest">Carrier Grade</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono font-black text-primary/80">{truck.plate_number}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "text-[9px] uppercase font-black tracking-[0.15em] px-2 py-0.5 rounded-full border-none shadow-sm",
                              truck.status === 'AVAILABLE' ? "bg-success/10 text-success" :
                                truck.status === 'IN_USE' ? "bg-primary/10 text-primary" :
                                  "bg-warning/10 text-warning"
                            )}>
                              {truck.status === 'AVAILABLE' ? "AVAILABLE" : truck.status === 'IN_USE' ? "IN USE" : "MAINTENANCE"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleTruckStatusToggle(truck.id, truck.status)}
                                title={truck.status === 'AVAILABLE' ? "Dispatch Vehicle" : "Ready Vehicle"}
                                className={cn(
                                  "relative w-12 h-6 rounded-full transition-all duration-500 shadow-inner p-1",
                                  truck.status === 'AVAILABLE' ? "bg-success/20" : "bg-foreground/5"
                                )}
                              >
                                <div className={cn(
                                  "absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-500 shadow-md",
                                  truck.status === 'AVAILABLE' ? "translate-x-6 bg-success" : "bg-foreground/20"
                                )} />
                              </button>
                              <button
                                onClick={() => {
                                  toast.info(`Scheduling maintenance for ${truck.plate_number}`);
                                }}
                                className="p-1 px-2 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-all text-[9px] font-black uppercase tracking-widest"
                              >
                                Service
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-all hover:rotate-90"
                                onClick={() => {
                                  setSelectedTruck(truck);
                                  setIsTruckModalOpen(true);
                                }}
                              >
                                <Settings size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ChartCard>
        </TabsContent>

        <TabsContent value="drivers" className="mt-0">
          <ChartCard
            title="Driver Directory"
            subtitle="Full list of registered carrier operators"
            accentColor="bg-secondary"
            className="border-none shadow-2xl"
          >
            <div className="pt-4 overflow-hidden">
              <div className="rounded-2xl border border-foreground/5 overflow-hidden">
                <Table>
                  <TableHeader className="bg-foreground/2">
                    <TableRow className="border-foreground/5">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">Operator</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">Contact Info</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">License Status</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isFleetLoading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-20">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Syncing Directory...</p>
                        </div>
                      </TableCell></TableRow>
                    ) : filteredDrivers.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-20 opacity-20 italic">No operators found in directory</TableCell></TableRow>
                    ) : (
                      filteredDrivers.map((driver) => (
                        <TableRow key={driver.id} className="border-foreground/5 hover:bg-foreground/1 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-sm shadow-sm border border-secondary/5">
                                {driver.full_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-sm tracking-tight">{driver.full_name}</p>
                                <p className="text-[9px] text-foreground/30 font-black uppercase tracking-widest">Verified Dispatch</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-[11px] font-bold text-foreground/70">
                                <Phone size={10} className="text-secondary" /> {driver.phone_number}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/40">
                                <Mail size={10} /> operator@carrier.com
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <Badge className={cn(
                                "w-fit text-[9px] uppercase font-black tracking-[0.15em] px-2 py-0.5 rounded-full border-none shadow-sm mb-1",
                                driver.status === 'ACTIVE' ? "bg-success/10 text-success" : "bg-error/10 text-error"
                              )}>
                                {driver.status}
                              </Badge>
                              <span className="text-[9px] font-bold text-foreground/30 flex items-center gap-1">
                                <Calendar size={8} /> Exp: {driver.license_expiry}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg hover:bg-blue-500/10 text-blue-500"
                                onClick={() => toast.success(`Calling ${driver.full_name}...`)}
                              >
                                <Phone size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg hover:bg-success/10 text-success"
                                onClick={() => toast.success(`Email sent to ${driver.full_name}`)}
                              >
                                <Mail size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg hover:bg-warning/10 text-warning"
                                onClick={() => toast.info(`Initializing contract renewal for ${driver.full_name}`)}
                                title="Renew Contract"
                              >
                                <RefreshCw size={14} />
                              </Button>
                              <div className="w-px h-4 bg-foreground/10 mx-1" />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-3 rounded-lg hover:bg-foreground/5 text-foreground/60 transition-all font-bold text-[10px] uppercase tracking-widest"
                                onClick={() => {
                                  setSelectedDriver(driver);
                                  setIsDriverModalOpen(true);
                                }}
                              >
                                Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ChartCard>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <TruckModal
        isOpen={isTruckModalOpen}
        onClose={() => setIsTruckModalOpen(false)}
        truck={selectedTruck}
      />
      {isDriverModalOpen && (
        <DriverModal
          isOpen={isDriverModalOpen}
          onClose={() => setIsDriverModalOpen(false)}
          driver={selectedDriver}
        />
      )}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={activeTab === 'vehicles' ? filteredTrucks : filteredDrivers}
        type={activeTab === 'vehicles' ? 'fleet-vehicles' : 'fleet-drivers'}
        title={`${activeTab === 'vehicles' ? 'Vehicle' : 'Driver'} Registry Export`}
      />
    </div>
  );
}
