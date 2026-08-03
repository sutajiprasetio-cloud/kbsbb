import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { GripVertical, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Stat = {
  id?: string;
  value: string;
  title: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

const ICON_SUGGESTIONS = [
  "Users", "Heart", "HandHeart", "Building2", "HelpingHand", "Gift",
  "Globe", "BookOpen", "Award", "Sprout", "Stethoscope", "HandCoins",
];

function IconPreview({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (LucideIcons as any)[(name ?? "").trim()] ?? LucideIcons.Heart;
  return <Icon className={className ?? "h-5 w-5"} />;
}

const EMPTY: Stat = { value: "", title: "", icon: "Users", sort_order: 0, is_active: true };

function ImpactStatsPage() {
  const client = supabase as any;
  const [rows, setRows] = useState<Stat[] | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  async function load() {
    const { data, error } = await client
      .from("impact_stats")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setRows((data ?? []) as Stat[]);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function save() {
    if (!editing) return;
    if (!editing.value.trim() || !editing.title.trim()) {
      return toast.error("Angka dan judul statistik wajib diisi.");
    }
    setSaving(true);
    const payload = {
      value: editing.value,
      title: editing.title,
      icon: editing.icon || "Users",
      sort_order: Number(editing.sort_order) || 0,
      is_active: !!editing.is_active,
    };
    const { error } = editing.id
      ? await client.from("impact_stats").update(payload).eq("id", editing.id)
      : await client.from("impact_stats").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Tersimpan");
    setOpen(false);
    load();
  }

  async function toggleActive(row: Stat) {
    const { error } = await client.from("impact_stats").update({ is_active: !row.is_active }).eq("id", row.id);
    if (error) return toast.error(error.message);
    setRows((r) => (r ?? []).map((x) => (x.id === row.id ? { ...x, is_active: !row.is_active } : x)));
  }

  async function remove(row: Stat) {
    if (!confirm("Hapus statistik ini?")) return;
    const { error } = await client.from("impact_stats").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Dihapus");
    load();
  }

  async function persistOrder(list: Stat[]) {
    setRows(list);
    await Promise.all(
      list.map((r, i) => client.from("impact_stats").update({ sort_order: i }).eq("id", r.id)),
    );
    toast.success("Urutan diperbarui");
  }

  function onDrop(targetId?: string) {
    if (!rows || !dragId || !targetId || dragId === targetId) return;
    const list = [...rows];
    const from = list.findIndex((r) => r.id === dragId);
    const to = list.findIndex((r) => r.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setDragId(null);
    persistOrder(list.map((r, i) => ({ ...r, sort_order: i })));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Statistik Dampak</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola angka dampak di beranda. Seret baris untuk mengubah urutan.
          </p>
        </div>
        <Button onClick={() => { setEditing({ ...EMPTY, sort_order: rows?.length ?? 0 }); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Statistik Baru
        </Button>
      </div>

      <Card className="divide-y p-0">
        {rows === null ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Belum ada statistik.</div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              draggable
              onDragStart={() => setDragId(row.id ?? null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(row.id)}
              className={`flex items-center gap-3 p-4 ${dragId === row.id ? "opacity-50" : ""}`}
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-brand text-white">
                <IconPreview name={row.icon} className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-lg font-extrabold tracking-tight">{row.value}</div>
                <div className="truncate text-xs text-muted-foreground">{row.title}</div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={row.is_active} onCheckedChange={() => toggleActive(row)} aria-label="Aktif" />
                <Button variant="ghost" size="icon" onClick={() => { setEditing({ ...row }); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(row)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Statistik" : "Statistik Baru"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Angka Statistik</Label>
                <Input
                  value={editing.value}
                  onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                  placeholder="500+ / 1.200+ / 1,5 Juta+"
                />
              </div>
              <div className="space-y-2">
                <Label>Judul Statistik</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Penerima Manfaat"
                />
              </div>
              <div className="space-y-2">
                <Label>Icon (nama Lucide)</Label>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-brand text-white">
                    <IconPreview name={editing.icon} className="h-4 w-4" />
                  </div>
                  <Input
                    value={editing.icon}
                    onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                    placeholder="Users"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {ICON_SUGGESTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEditing({ ...editing, icon: n })}
                      aria-pressed={editing.icon === n}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                        editing.icon === n ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <IconPreview name={n} className="h-3.5 w-3.5" /> {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.is_active}
                  onCheckedChange={(c) => setEditing({ ...editing, is_active: c })}
                />
                <span className="text-sm text-muted-foreground">{editing.is_active ? "Aktif" : "Nonaktif"}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/impact-stats")({
  component: ImpactStatsPage,
});
