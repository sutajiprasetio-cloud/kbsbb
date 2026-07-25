import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

const ROLES = ["super_admin", "admin", "editor"] as const;
type Role = typeof ROLES[number];

function UsersPage() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [isSuper, setIsSuper] = useState<boolean | null>(null);

  async function load() {
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes.user?.id;
    if (!uid) return;
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "super_admin");
    const superAdmin = (r?.length ?? 0) > 0;
    setIsSuper(superAdmin);
    if (!superAdmin) return;
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const byUser: Record<string, string[]> = {};
    (roles ?? []).forEach((r: any) => {
      byUser[r.user_id] = byUser[r.user_id] || [];
      byUser[r.user_id].push(r.role);
    });
    setRows((profiles ?? []).map((p: any) => ({ ...p, roles: byUser[p.id] ?? [] })));
  }
  useEffect(() => { load(); }, []);

  async function toggle(userId: string, role: Role, has: boolean) {
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
    }
    toast.success("Role updated");
    load();
  }

  if (isSuper === false) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive mb-4" />
        <h1 className="text-xl font-bold">Super admin only</h1>
        <p className="mt-2 text-sm text-muted-foreground">Only super admins can manage user roles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Grant or revoke admin roles.</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Manage roles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(rows ?? []).map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="font-medium">{u.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {u.roles.length === 0 && <span className="text-xs text-muted-foreground">Public user</span>}
                    {u.roles.map((r: string) => <Badge key={r} variant="secondary">{r}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  {ROLES.map((r) => (
                    <Button key={r} size="sm" variant={u.roles.includes(r) ? "default" : "outline"} onClick={() => toggle(u.id, r, u.roles.includes(r))}>
                      {r}
                    </Button>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});
