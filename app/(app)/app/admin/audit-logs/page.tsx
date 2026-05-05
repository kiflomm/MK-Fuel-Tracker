"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { getAuditLogs, AuditLog } from "@/lib/api/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function AuditLogsPage() {
  const { accessToken } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    void fetchLogs();
  }, [accessToken]);

  const fetchLogs = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await getAuditLogs(accessToken, { limit: 100 });
      setLogs(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-violet-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-violet-400 uppercase">Security & Oversight</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Audit Logs</h1>
            <p className="text-sm text-neutral-400 font-medium">Monitor system-wide activity, user actions, and security events.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchLogs} 
            disabled={loading}
            className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full border-none"
          >
            {loading ? "Refreshing..." : "Refresh Logs"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/50">
              <TableHead className="font-bold text-[11px] uppercase tracking-wider">Time</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-wider">User</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-wider">Action</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-wider">Entity</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-wider text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-violet-600">progress_activity</span>
                    <span className="text-sm text-neutral-500 font-medium">Retrieving activity trail...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-neutral-300 text-4xl">history</span>
                    <span className="text-sm text-neutral-500 font-medium">No audit logs discovered yet.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                  <TableCell className="whitespace-nowrap font-mono text-[11px] text-neutral-500">
                    {formatDate(log.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-900 text-sm">
                        {log.userFirstName} {log.userLastName}
                      </span>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-violet-600/70">
                          {log.userRole?.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-neutral-400">ID: {log.userId}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider ring-1 ring-inset",
                      log.action.includes("DELETE") || log.action.includes("DISABLE") 
                        ? "bg-red-50 text-red-700 ring-red-700/10"
                        : log.action.includes("CREATE") || log.action.includes("ADD")
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-700/10"
                          : "bg-blue-50 text-blue-700 ring-blue-700/10"
                    )}>
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-neutral-700 text-xs">{log.entity}</span>
                      {log.entityId && <span className="text-[10px] text-neutral-400">#UID-{log.entityId}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {log.details && Object.keys(log.details).length > 0 ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-700 hover:bg-violet-50 transition-all rounded-lg">
                            Investigation
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
                          <DialogHeader className="p-6 bg-gradient-to-br from-violet-900 to-violet-950 text-white shadow-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-violet-300">data_object</span>
                              </div>
                              <div>
                                <DialogTitle className="text-xl font-black tracking-tight text-white">Action Payload Detail</DialogTitle>
                                <p className="text-xs text-violet-200/70 font-medium">Cryptographically recorded system event data</p>
                              </div>
                            </div>
                          </DialogHeader>
                          <div className="p-6 overflow-y-auto bg-neutral-900 flex-1">
                            <pre className="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                          <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
                            <DialogTrigger asChild>
                               <Button className="bg-neutral-900 text-white hover:bg-black rounded-lg text-[10px] font-black uppercase tracking-widest px-6 shadow-md">Close Incident View</Button>
                            </DialogTrigger>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">No Payload</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
