"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  User,
  Terminal,
  Bot,
  Edit2,
  Trash2,
  Settings,
  StopCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
];

type AgentType = "Optimization" | "Planning" | "Analytics";
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

  const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = "bg-gray-100 text-gray-600 hover:bg-gray-200";
    if (status === "Active" || status === "Operational") colorClass = "bg-green-100 text-green-700 hover:bg-green-200";
    if (status === "Maintenance" || status === "Inactive") colorClass = "bg-orange-100 text-orange-700 hover:bg-orange-200";
    if (status === "Offline") colorClass = "bg-red-100 text-red-700 hover:bg-red-200";

    return (
      <Badge className={cn("font-medium shadow-none", colorClass)}>
        {status}
      </Badge>
    );
  };

  const ProgressBar = ({ value, max }: { value: number; max: number }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    let barColor = "bg-blue-500";
    if (percentage > 80) barColor = "bg-orange-500";
    if (percentage > 95) barColor = "bg-red-500";

    return (
      <div className="w-full max-w-[140px]">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">{value} / {max}</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-500 rounded-full", barColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 font-poppins text-slate-800">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Configuration Management</h1>
        <p className="text-slate-500">Manage users, terminals and AI agents for the logistics portal</p>
      </div>

      {/* Main Content */}
      <Card className="border-border/40 shadow-sm bg-white">
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">

          {/* Tabs Header */}
          <div className="px-6 pt-6 pb-0 border-b border-border/40">
            <TabsList className="bg-transparent p-0 h-auto gap-6 -mb-px">
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none px-2 pb-4 pt-2 text-slate-500 hover:text-slate-700 transition-all gap-2"
              >
                <User size={16} />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="terminals"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none px-2 pb-4 pt-2 text-slate-500 hover:text-slate-700 transition-all gap-2"
              >
                <Terminal size={16} />
                Terminals
              </TabsTrigger>
              <TabsTrigger
                value="agents"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none px-2 pb-4 pt-2 text-slate-500 hover:text-slate-700 transition-all gap-2"
              >
                <Bot size={16} />
                AI Agents
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-[350px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    activeTab === "users" ? "Search users by name, email..." :
                      activeTab === "terminals" ? "Search by name or location..." :
                        "Search agents by type..."
                  }
                  className="pl-9 border-slate-200 focus-visible:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95">
                    <Plus className="mr-2 h-4 w-4" />
                    {activeTab === "users" ? "Add User" : activeTab === "terminals" ? "Add Terminal" : "Add Agent"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New {activeTab === "users" ? "User" : activeTab === "terminals" ? "Terminal" : "Agent"}</DialogTitle>
                    <DialogDescription>
                      Create a new entry in the configuration.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400 text-sm">
                      Form Placeholder
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Content Tabs */}

            {/* 1. USERS TAB */}
            <TabsContent value="users" className="mt-0">
              <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-600">User</TableHead>
                      <TableHead className="font-semibold text-slate-600">Email</TableHead>
                      <TableHead className="font-semibold text-slate-600">Role</TableHead>
                      <TableHead className="font-semibold text-slate-600">Status</TableHead>
                      <TableHead className="font-semibold text-slate-600">Last Active</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold font-poppins">
                              {user.name.charAt(0)}
                            </div>
                            {user.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-200 text-slate-600 bg-transparent font-normal">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">{user.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                              <Edit2 size={15} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 2. TERMINALS TAB */}
            <TabsContent value="terminals" className="mt-0">
              <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-600">Terminal</TableHead>
                      <TableHead className="font-semibold text-slate-600">Location</TableHead>
                      <TableHead className="font-semibold text-slate-600">Capacity Load</TableHead>
                      <TableHead className="font-semibold text-slate-600">Status</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTerminals.map((terminal) => (
                      <TableRow key={terminal.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                              <Terminal size={16} />
                            </div>
                            {terminal.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">{terminal.location}</TableCell>
                        <TableCell>
                          <ProgressBar value={terminal.load} max={terminal.capacity} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={terminal.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                              <Settings size={15} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 3. AI AGENTS TAB */}
            <TabsContent value="agents" className="mt-0">
              <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-600">Agent Name</TableHead>
                      <TableHead className="font-semibold text-slate-600">Type</TableHead>
                      <TableHead className="font-semibold text-slate-600">Status</TableHead>
                      <TableHead className="font-semibold text-slate-600">Last Sync</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgents.map((agent) => (
                      <TableRow key={agent.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                              <Bot size={16} />
                            </div>
                            {agent.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                            {agent.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {agent.status === "Active" ? (
                              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-slate-300" />
                            )}
                            <span className={cn("text-sm", agent.status === "Active" ? "text-green-700 font-medium" : "text-slate-500")}>{agent.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm font-mono">{agent.lastSync}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50 gap-2">
                              <StopCircle size={14} />
                              <span className="sr-only sm:not-sr-only">Stop</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                              <Settings size={15} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

          </div>
        </Tabs>
      </Card>
    </div>
  );
}
