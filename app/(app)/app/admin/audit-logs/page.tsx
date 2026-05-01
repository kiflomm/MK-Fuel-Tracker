"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { getAuditLogs, AuditLog } from "@/lib/api/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <Button variant="outline" onClick={fetchLogs} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && logs.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading logs...</TableCell></TableRow>
            ) : logs.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-neutral-500">No audit logs found.</TableCell></TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">{formatDate(log.createdAt)}</TableCell>
                  <TableCell>
                    {log.userFirstName} {log.userLastName}
                    <div className="text-xs text-neutral-500">ID: {log.userId}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium px-2 py-1 bg-neutral-100 rounded-full">
                      {log.userRole?.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>
                    {log.entity}
                    {log.entityId && <div className="text-xs text-neutral-500">ID: {log.entityId}</div>}
                  </TableCell>
                  <TableCell>
                    {log.details && Object.keys(log.details).length > 0 ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">View Payload</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Action Details</DialogTitle>
                          </DialogHeader>
                          <pre className="text-xs bg-neutral-100 p-4 rounded-md overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-xs text-neutral-400">None</span>
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
