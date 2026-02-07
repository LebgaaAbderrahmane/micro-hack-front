"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Plus, Trash, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";

export default function OperatorSlots() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [isCreatingSlot, setIsCreatingSlot] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [terminals, setTerminals] = useState<any[]>([]);
  const [newSlot, setNewSlot] = useState({
    terminal_id: "",
    slot_date: format(new Date(), "yyyy-MM-dd"),
    start_time: "08:00",
    end_time: "09:00",
    max_capacity: 10,
  });

  const fetchTerminals = async () => {
    const { data, error } = await supabase.from("terminals").select(`
            *,
            gate:gates(gate_number)
        `);
    if (error) {
      console.error("Error fetching terminals:", error);
      toast.error("Failed to load terminals");
    }
    if (data) {
      setTerminals(data);
      if (data.length > 0 && !newSlot.terminal_id) {
        setNewSlot((prev) => ({ ...prev, terminal_id: data[0].id }));
      }
    }
  };

  const fetchSlots = async () => {
    const { data, error } = await supabase
      .from("active_slots")
      .select(
        `
                *,
                terminal:terminals(
                    zone_name,
                    gate:gates(gate_number)
                )
            `,
      )
      .order("slot_date", { ascending: false })
      .order("start_time", { ascending: true });
    if (data) setSlots(data);
  };

  const handleSeedData = async () => {
    try {
      setLoading(true);
      // 1. Ensure Port
      let { data: ports } = await supabase.from("ports").select("id").limit(1);
      let portId = ports?.[0]?.id;

      if (!portId) {
        const { data: newPort, error: portError } = await supabase
          .from("ports")
          .insert({
            name: "Main Port",
            code: "MPT",
            wilaya: "Algiers",
          })
          .select()
          .single();
        if (portError) throw portError;
        portId = newPort.id;
      }

      // 2. Ensure Gate
      let { data: gates } = await supabase
        .from("gates")
        .select("id")
        .eq("port_id", portId)
        .limit(1);
      let gateId = gates?.[0]?.id;

      if (!gateId) {
        const { data: newGate, error: gateError } = await supabase
          .from("gates")
          .insert({
            port_id: portId,
            gate_number: "G1",
            gate_status: "OPERATIONAL",
          })
          .select()
          .single();
        if (gateError) throw gateError;
        gateId = newGate.id;
      }

      // 3. Ensure Terminals (at least 2)
      const { data: existingTerminals } = await supabase
        .from("terminals")
        .select("zone_code")
        .eq("port_id", portId);
      const existingCodes = existingTerminals?.map((t) => t.zone_code) || [];

      let created = 0;

      // Create Zone A if missing
      if (!existingCodes.includes("Z-A")) {
        const { error: termError } = await supabase.from("terminals").insert({
          port_id: portId,
          gate_id: gateId,
          zone_name: "Zone A",
          zone_code: "Z-A",
          total_capacity: 100,
        });
        if (termError) throw termError;
        created++;
      }

      // Create Zone B if missing
      if (!existingCodes.includes("Z-B")) {
        const { error: termError } = await supabase.from("terminals").insert({
          port_id: portId,
          gate_id: gateId,
          zone_name: "Zone B",
          zone_code: "Z-B",
          total_capacity: 150,
        });
        if (termError) throw termError;
        created++;
      }

      if (created > 0) {
        toast.success(`Created ${created} default terminals (Zone A & B)`);
      } else {
        toast.info("Default terminals (Zone A & B) already exist");
      }

      await fetchTerminals();
    } catch (err: any) {
      console.error(err);
      toast.error("Seed failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async () => {
    // Validation
    if (!newSlot.terminal_id) {
      toast.error(
        "Please select a terminal. Click 'Seed Data' if no terminals exist.",
      );
      return;
    }
    if (!newSlot.slot_date || !newSlot.start_time || !newSlot.end_time) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (newSlot.start_time >= newSlot.end_time) {
      toast.error("End time must be after start time.");
      return;
    }
    if (newSlot.max_capacity < 1) {
      toast.error("Capacity must be at least 1.");
      return;
    }

    setIsCreatingSlot(true);
    const { error } = await supabase.from("active_slots").insert([
      {
        ...newSlot,
        start_time: newSlot.start_time + ":00",
        end_time: newSlot.end_time + ":00",
        current_occupancy: 0,
        status: "AVAILABLE",
      },
    ]);

    setIsCreatingSlot(false);
    if (error) {
      toast.error("Failed to create slot: " + error.message);
    } else {
      toast.success("Slot created successfully!");
      fetchSlots();
      // Reset form times
      setNewSlot((prev) => ({
        ...prev,
        start_time: "08:00",
        end_time: "09:00",
      }));
    }
  };

  const handleDeleteSlot = async (id: string) => {
    const { error } = await supabase.from("active_slots").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete slot");
    } else {
      toast.success("Slot deleted");
      fetchSlots();
    }
  };

  useEffect(() => {
    fetchTerminals();
    fetchSlots();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Slot Management</h2>
          <p className="text-muted-foreground">
            Manage port terminals and time slots
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchSlots()}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Time Slot</CardTitle>
          <CardDescription>
            Manually add available booking slots for carriers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Terminal / Gate</label>
              {terminals.length === 0 ? (
                <div className="text-sm text-muted-foreground p-2 border rounded bg-warning/10 border-warning/30">
                  No terminals found. Click "Seed Data" below to create one.
                </div>
              ) : (
                <select
                  className="w-full text-sm border rounded p-2 bg-background"
                  value={newSlot.terminal_id}
                  onChange={(e) =>
                    setNewSlot((prev) => ({
                      ...prev,
                      terminal_id: e.target.value,
                    }))
                  }
                >
                  <option value="">Select a terminal...</option>
                  {terminals.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.zone_name} (Gate {t.gate?.gate_number || "?"})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newSlot.slot_date}
                onChange={(e) =>
                  setNewSlot((prev) => ({ ...prev, slot_date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={newSlot.start_time}
                onChange={(e) =>
                  setNewSlot((prev) => ({
                    ...prev,
                    start_time: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={newSlot.end_time}
                onChange={(e) =>
                  setNewSlot((prev) => ({ ...prev, end_time: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Capacity</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={newSlot.max_capacity}
                onChange={(e) =>
                  setNewSlot((prev) => ({
                    ...prev,
                    max_capacity: parseInt(e.target.value) || 10,
                  }))
                }
                placeholder="10"
              />
            </div>
            <Button
              onClick={handleCreateSlot}
              className="w-full"
              disabled={
                isCreatingSlot || terminals.length === 0 || !newSlot.terminal_id
              }
            >
              {isCreatingSlot ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Create Slot
                </>
              )}
            </Button>
          </div>
          {terminals.length === 0 && (
            <div className="mt-4 p-4 border border-dashed border-primary/30 rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground mb-3">
                No terminals found. Create initial port/gate/terminal data to
                get started.
              </p>
              <Button
                onClick={handleSeedData}
                variant="outline"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  <>Create Seed Data</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Active Slots</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gate</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time Range</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    {slot.terminal?.zone_name} (Gate{" "}
                    {slot.terminal?.gate?.gate_number || "?"})
                  </TableCell>
                  <TableCell>
                    {format(new Date(slot.slot_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {slot.current_occupancy} / {slot.max_capacity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDeleteSlot(slot.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
