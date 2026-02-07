"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Users,
  Ship,
  Bot,
  Pencil,
  Trash2,
  Settings,
  CirclePlay,
  CirclePause,
  CheckCircle2,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// --- Types & Sample Data ---

type UserStatus = "Active" | "Inactive";
type UserRole = "Admin" | "Operator" | "Carrier";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
}

const usersData: UserData[] = [
  { id: 1, name: "John Doe", email: "john@port.com", role: "Admin", status: "Active", lastActive: "2 mins ago" },
  { id: 2, name: "Sarah Smith", email: "sarah@terminal.com", role: "Operator", status: "Active", lastActive: "15 mins ago" },
  { id: 3, name: "Mike Johnson", email: "mike@carrier.com", role: "Carrier", status: "Active", lastActive: "1 hour ago" },
  { id: 4, name: "Emily Davis", email: "emily@port.com", role: "Admin", status: "Inactive", lastActive: "2 days ago" },
  { id: 5, name: "Robert Wilson", email: "robert@carrier.com", role: "Carrier", status: "Active", lastActive: "30 mins ago" },
];

type TerminalStatus = "Operational" | "Maintenance" | "Offline";

interface TerminalData {
  id: number;
  name: string;
  location: string;
  capacity: number;
  load: number;
  status: TerminalStatus;
}

const terminalsData: TerminalData[] = [
  { id: 1, name: "Terminal A", location: "North Port", capacity: 1000, load: 750, status: "Operational" },
  { id: 2, name: "Terminal B", location: "South Port", capacity: 1500, load: 1200, status: "Operational" },
  { id: 3, name: "Terminal C", location: "East Port", capacity: 800, load: 400, status: "Maintenance" },
  { id: 4, name: "Terminal D", location: "West Port", capacity: 2000, load: 0, status: "Offline" },
  { id: 5, name: "Terminal E", location: "Central Port", capacity: 1200, load: 950, status: "Operational" },
];

type AgentType = "Optimization" | "Planning" | "Analytics" | "Inventory";
type AgentStatus = "Active" | "Inactive";

interface AgentData {
  id: number;
  name: string;
  type: AgentType;
  status: AgentStatus;
  lastSync: string;
}

const agentsData: AgentData[] = [
  { id: 1, name: "Booking Optimizer", type: "Optimization", status: "Active", lastSync: "5 mins ago" },
  { id: 2, name: "Route Planner", type: "Planning", status: "Active", lastSync: "10 mins ago" },
  { id: 3, name: "Capacity Analyzer", type: "Analytics", status: "Active", lastSync: "1 hour ago" },
  { id: 4, name: "Inventory Manager", type: "Inventory", status: "Inactive", lastSync: "1 day ago" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  // --- Filter Logic ---
  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTerminals = terminalsData.filter(terminal =>
    terminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    terminal.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAgents = agentsData.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Helper Components ---

  const RoleBadge = ({ role }: { role: UserRole }) => {
    const roles: Record<UserRole, string> = {
      Admin: "bg-[#4b97fb]",
      Operator: "bg-[#71dd8c]",
      Carrier: "bg-[#9a80f9]",
    };
    return (
      <Badge className={cn("text-white font-bold text-[10px] px-2 py-0.5 border-none shadow-none uppercase tracking-tight", roles[role])}>
        {role}
      </Badge>
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = "bg-[#a5a5a5]"; // Default/Inactive
    if (status === "Active" || status === "Operational") colorClass = "bg-[#71dd8c]";
    if (status === "Maintenance") colorClass = "bg-[#f6ad55]";
    if (status === "Offline") colorClass = "bg-[#f56565]";

    return (
      <Badge className={cn("text-white font-bold text-[10px] px-2 py-0.5 border-none shadow-none uppercase tracking-tight", colorClass)}>
        {status}
      </Badge>
    );
  };

  const ProgressBar = ({ value, max }: { value: number; max: number }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    let barColor = "bg-[#f6ad55]"; // Default
    if (percentage < 50) barColor = "bg-[#71dd8c]";
    if (percentage > 90) barColor = "bg-[#f56565]";

    return (
      <div className="w-full max-w-[120px]">
        <div className="text-[11px] font-bold mb-1 text-slate-700">
          {value} / {max}
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-500 rounded-full", barColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-white p-8 space-y-6 font-poppins relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle, #f1f5f9 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-medium text-slate-800 tracking-tight">Configuration Management</h1>
        <p className="text-slate-500 text-sm">Manage users, terminals, and AI agents for the logistics portal</p>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tabs List */}
        <TabsList className="bg-transparent p-0 h-auto gap-1 border-b border-slate-200 w-full justify-start rounded-none">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-white data-[state=active]:border-slate-200 data-[state=active]:border-b-white border border-transparent border-b-transparent rounded-t-xl px-6 py-2.5 flex items-center gap-2 text-slate-500 data-[state=active]:text-slate-900 font-bold text-sm transition-all"
          >
            <Users size={16} className="text-indigo-500" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="terminals"
            className="data-[state=active]:bg-white data-[state=active]:border-slate-200 data-[state=active]:border-b-white border border-transparent border-b-transparent rounded-t-xl px-6 py-2.5 flex items-center gap-2 text-slate-500 data-[state=active]:text-slate-900 font-bold text-sm transition-all"
          >
            <Ship size={16} className="text-blue-500" />
            Terminals
          </TabsTrigger>
          <TabsTrigger
            value="agents"
            className="data-[state=active]:bg-white data-[state=active]:border-slate-200 data-[state=active]:border-b-white border border-transparent border-b-transparent rounded-t-xl px-6 py-2.5 flex items-center gap-2 text-slate-500 data-[state=active]:text-slate-900 font-bold text-sm transition-all"
          >
            <Bot size={16} className="text-pink-500" />
            AI Agents
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-10 h-10 border-slate-200 bg-white placeholder:text-slate-400 text-sm rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-tile-blue hover:bg-tile-blue/90 text-white px-4 h-10 gap-2 font-bold text-xs rounded-lg shadow-sm">
              <Plus size={16} />
              Add {activeTab === "users" ? "User" : activeTab === "terminals" ? "Terminal" : "Agent"}
            </Button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-white border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] text-center"><Checkbox /></TableHead>
                  {activeTab === "users" && (
                    <>
                      <TableHead className="font-bold text-slate-800">User</TableHead>
                      <TableHead className="font-bold text-slate-800">Email</TableHead>
                      <TableHead className="font-bold text-slate-800 text-center">Role</TableHead>
                      <TableHead className="font-bold text-slate-800 text-center">Status</TableHead>
                      <TableHead className="font-bold text-slate-800 text-center">Last Active</TableHead>
                    </>
                  )}
                  {activeTab === "terminals" && (
                    <>
                      <TableHead className="font-bold text-slate-800">Terminal</TableHead>
                      <TableHead className="font-bold text-slate-800">Location</TableHead>
                      <TableHead className="font-bold text-slate-800 text-center">Capacity</TableHead>
                      <TableHead className="font-bold text-slate-800">Load</TableHead>
                      <TableHead className="font-bold text-slate-800 text-center">Status</TableHead>
                    </>
                  )}
                  {activeTab === "agents" && (
                    <>
                      <TableHead className="font-bold text-slate-800">Agent Name</TableHead>
                      <TableHead className="font-bold text-slate-800">Type</TableHead>
                      <TableHead className="font-bold text-slate-800 text-center">Status</TableHead>
                      <TableHead className="font-bold text-slate-800 text-center">Last Sync</TableHead>
                    </>
                  )}
                  <TableHead className="font-bold text-slate-800 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* USERS */}
                {activeTab === "users" && filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group border-slate-50">
                    <TableCell className="text-center"><Checkbox /></TableCell>
                    <TableCell className="font-bold text-slate-700">{user.name}</TableCell>
                    <TableCell className="text-slate-500 font-medium">{user.email}</TableCell>
                    <TableCell className="text-center"><RoleBadge role={user.role} /></TableCell>
                    <TableCell className="text-center"><StatusBadge status={user.status} /></TableCell>
                    <TableCell className="text-center text-slate-500 text-sm font-medium">{user.lastActive}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 transition-colors">
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {/* TERMINALS */}
                {activeTab === "terminals" && filteredTerminals.map((terminal) => (
                  <TableRow key={terminal.id} className="group border-slate-50">
                    <TableCell className="text-center"><Checkbox /></TableCell>
                    <TableCell className="font-bold text-slate-700">{terminal.name}</TableCell>
                    <TableCell className="text-slate-500 font-medium">{terminal.location}</TableCell>
                    <TableCell className="text-center font-bold text-slate-700">{terminal.capacity}</TableCell>
                    <TableCell><ProgressBar value={terminal.load} max={terminal.capacity} /></TableCell>
                    <TableCell className="text-center"><StatusBadge status={terminal.status} /></TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 transition-colors">
                          <Settings size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {/* AGENTS */}
                {activeTab === "agents" && filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className="group border-slate-50">
                    <TableCell className="text-center"><Checkbox /></TableCell>
                    <TableCell className="font-bold text-slate-700">{agent.name}</TableCell>
                    <TableCell className="text-slate-500 font-bold text-xs uppercase tracking-tight">{agent.type}</TableCell>
                    <TableCell className="text-center"><StatusBadge status={agent.status} /></TableCell>
                    <TableCell className="text-center text-slate-500 text-sm font-medium font-mono">{agent.lastSync}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 transition-colors", agent.status === "Active" ? "text-orange-400 hover:text-orange-600" : "text-green-400 hover:text-green-600")}>
                          {agent.status === "Active" ? <CirclePause size={16} /> : <CirclePlay size={16} />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 transition-colors">
                          <Settings size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

