import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MediaPicker } from "./media-picker";
import { SafeImage, useMediaUrl } from "@/components/safe-image";

export type FieldType = "text" | "textarea" | "richtext" | "number" | "boolean" | "image" | "datetime" | "select" | "tags" | "display_mode";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  span?: 1 | 2;
  /** For type "display_mode": which field holds the image to preview. */
  previewField?: string;
};

export type Column = {
  name: string;
  label: string;
  render?: (row: any) => React.ReactNode;
};

export type CrudPageProps = {
  title: string;
  description?: string;
  table: string;
  fields: Field[];
  columns: Column[];
  searchFields?: string[];
  orderBy?: { column: string; ascending?: boolean };
  defaultValues?: Record<string, any>;
  pageSize?: number;
  singleton?: boolean; // edit only, one row (about_content)
  singletonId?: string | number;
};

export function CrudPage(props: CrudPageProps) {
  const {
    title, description, table, fields, columns, searchFields = [],
    orderBy = { column: "created_at", ascending: false },
    defaultValues = {}, pageSize = 10, singleton, singletonId = 1,
  } = props;

  const [rows, setRows] = useState<any[] | null>(null);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const client = supabase as any;

  async function load() {
    setRows(null);
    let q = client.from(table).select("*", { count: "exact" });
    if (query && searchFields.length) {
      const or = searchFields.map((f) => `${f}.ilike.%${query}%`).join(",");
      q = q.or(or);
    }
    q = q.order(orderBy.column, { ascending: !!orderBy.ascending });
    q = q.range(page * pageSize, page * pageSize + pageSize - 1);
    const { data, error, count: c } = await q;
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setCount(c ?? 0);
  }

  async function loadSingleton() {
    setRows(null);
    const { data } = await client.from(table).select("*").eq("id", singletonId).maybeSingle();
    if (data) { setEditing(data); }
    else { setEditing({ id: singletonId, ...defaultValues }); }
    setRows([]);
  }

  useEffect(() => {
    if (singleton) loadSingleton();
    else load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query]);

  function openNew() {
    setEditing({ ...defaultValues });
    setOpen(true);
  }
  function openEdit(row: any) {
    setEditing({ ...row });
    setOpen(true);
  }
  async function del(row: any) {
    if (!confirm("Delete this item?")) return;
    const { error } = await client.from(table).delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }
  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const payload: any = {};
      for (const f of fields) {
        let v = editing[f.name];
        if (f.type === "number") v = v === "" || v == null ? null : Number(v);
        if (f.type === "tags" && typeof v === "string") v = v.split(",").map((s: string) => s.trim()).filter(Boolean);
        if (f.type === "datetime" && v === "") v = null;
        payload[f.name] = v;
      }
      if (singleton) {
        const { error } = await client.from(table).upsert({ id: singletonId, ...payload });
        if (error) throw error;
        toast.success("Saved");
      } else if (editing.id) {
        const { error } = await client.from(table).update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Updated");
      } else {
        const { error } = await client.from(table).insert(payload);
        if (error) throw error;
        toast.success("Created");
      }
      setOpen(false);
      singleton ? loadSingleton() : load();
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  if (singleton) {
    return (
      <div className="space-y-6">
        <Header title={title} description={description} />
        <Card className="p-6">
          {editing ? <FormFields fields={fields} value={editing} onChange={setEditing} /> : <Skeleton className="h-64 w-full" />}
          <div className="mt-6 flex justify-end">
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <Header title={title} description={description} />
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New</Button>
      </div>

      {searchFields.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder="Search..." className="pl-9" />
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => <TableHead key={c.name}>{c.label}</TableHead>)}
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows === null ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>{columns.map((c) => <TableCell key={c.name}><Skeleton className="h-4 w-24" /></TableCell>)}<TableCell /></TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-sm text-muted-foreground py-10">No records yet.</TableCell></TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={c.name}>
                    {c.render ? c.render(row) : renderCell(row[c.name])}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(row)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(row)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>{count} total</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span>{page + 1} / {totalPages}</span>
          <Button variant="outline" size="icon" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? `Edit ${title}` : `New ${title}`}</DialogTitle>
          </DialogHeader>
          {editing && <FormFields fields={fields} value={editing} onChange={setEditing} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Header({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

function renderCell(v: any) {
  if (v === null || v === undefined || v === "") return <span className="text-muted-foreground">—</span>;
  if (typeof v === "boolean") return v ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>;
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "string" && v.length > 60) return v.slice(0, 60) + "…";
  if (typeof v === "string" && /^https?:\/\//.test(v) && /\.(png|jpg|jpeg|webp|gif|svg)/i.test(v)) {
    return <img src={v} alt="" className="h-10 w-10 rounded object-cover" />;
  }
  if (typeof v === "string" && v.match(/^\d{4}-\d{2}-\d{2}T/)) return new Date(v).toLocaleString();
  return String(v);
}

function FormFields({ fields, value, onChange }: { fields: Field[]; value: any; onChange: (v: any) => void }) {
  function set(name: string, v: any) { onChange({ ...value, [name]: v }); }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((f) => {
        const v = value[f.name] ?? "";
        const wrapper = f.span === 2 || f.type === "textarea" ? "md:col-span-2" : "";
        return (
          <div key={f.name} className={`space-y-2 ${wrapper}`}>
            <Label htmlFor={f.name}>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
            {f.type === "textarea" ? (
              <Textarea id={f.name} value={v} onChange={(e) => set(f.name, e.target.value)} rows={5} placeholder={f.placeholder} />
            ) : f.type === "boolean" ? (
              <div className="flex items-center gap-2 h-10">
                <Switch checked={!!v} onCheckedChange={(c) => set(f.name, c)} />
                <span className="text-sm text-muted-foreground">{v ? "Yes" : "No"}</span>
              </div>
            ) : f.type === "image" ? (
              <MediaPicker value={v} onChange={(u) => set(f.name, u)} />
            ) : f.type === "display_mode" ? (
              <DisplayModeField
                value={v || "cover"}
                onChange={(m) => set(f.name, m)}
                imageSrc={value[f.previewField ?? "image_url"]}
              />
            ) : f.type === "select" ? (
              <select id={f.name} value={v} onChange={(e) => set(f.name, e.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                <option value="">—</option>
                {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === "datetime" ? (
              <Input id={f.name} type="datetime-local" value={toLocalInput(v)} onChange={(e) => set(f.name, e.target.value ? new Date(e.target.value).toISOString() : null)} />
            ) : f.type === "number" ? (
              <Input id={f.name} type="number" value={v ?? ""} onChange={(e) => set(f.name, e.target.value)} />
            ) : f.type === "tags" ? (
              <Input id={f.name} value={Array.isArray(v) ? v.join(", ") : v} onChange={(e) => set(f.name, e.target.value)} placeholder="tag1, tag2" />
            ) : (
              <Input id={f.name} value={v ?? ""} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function toLocalInput(v: any) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

export const DISPLAY_MODES = [
  {
    value: "cover",
    label: "Memenuhi Frame",
    desc: "Gambar memenuhi seluruh area slider. Sebagian gambar mungkin terpotong agar frame terisi penuh.",
  },
  {
    value: "contain",
    label: "Sesuai Ukuran Foto",
    desc: "Gambar ditampilkan utuh tanpa terpotong. Area kosong diisi background blur dari gambar yang sama.",
  },
  {
    value: "fill",
    label: "Stretch ke Frame",
    desc: "Gambar dipaksa mengikuti ukuran slider. Tidak ada ruang kosong, namun gambar bisa terlihat melebar.",
  },
] as const;

function DisplayModeField({
  value,
  onChange,
  imageSrc,
}: {
  value: string;
  onChange: (mode: string) => void;
  imageSrc?: string | null;
}) {
  const url = useMediaUrl(imageSrc);
  const fit = value === "contain" ? "object-contain" : value === "fill" ? "object-fill" : "object-cover";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {DISPLAY_MODES.map((m) => {
          const active = value === m.value;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => onChange(m.value)}
              aria-pressed={active}
              className={`rounded-lg border p-3 text-left transition-colors ${
                active ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                    active ? "border-primary" : "border-muted-foreground/40"
                  }`}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-primary" />}
                </span>
                <span className="text-sm font-medium">{m.label}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
            </button>
          );
        })}
      </div>

      <div>
        <p className="mb-2 text-xs text-muted-foreground">Pratinjau langsung</p>
        <div className="relative h-40 w-full overflow-hidden rounded-lg border bg-muted md:h-56">
          {imageSrc ? (
            <>
              {value === "contain" && (
                <div
                  className="absolute inset-0 scale-110 bg-cover bg-center"
                  style={{ backgroundImage: `url("${url}")`, filter: "blur(20px)", opacity: 0.3 }}
                  aria-hidden
                />
              )}
              <SafeImage
                src={imageSrc}
                alt="Pratinjau slide"
                className={`absolute inset-0 h-full w-full object-center ${fit}`}
              />
            </>
          ) : (
            <div className="grid h-full place-items-center text-xs text-muted-foreground">
              Unggah gambar untuk melihat pratinjau
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
