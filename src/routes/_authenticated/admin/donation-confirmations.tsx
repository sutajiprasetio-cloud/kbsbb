import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SafeImage } from "@/components/safe-image";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Row = {
  id: string;
  name: string;
  phone: string;
  amount: number;
  payment_method: string;
  message: string | null;
  proof_image: string | null;
  status: string;
  created_at: string;
};

const STATUSES = [
  { value: "pending", label: "Menunggu Verifikasi" },
  { value: "approved", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
];

const METHODS: Record<string, string> = { transfer: "Transfer Bank", qris: "QRIS" };

function statusBadge(s: string) {
  if (s === "approved") return <Badge>Diterima</Badge>;
  if (s === "rejected") return <Badge variant="destructive">Ditolak</Badge>;
  return <Badge variant="secondary">Menunggu Verifikasi</Badge>;
}

function ConfirmationsPage() {
  const client = supabase as any;
  const [rows, setRows] = useState<Row[] | null>(null);
  const [proof, setProof] = useState<string | null>(null);

  async function load() {
    const { data, error } = await client
      .from("donation_confirmations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as Row[]);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function setStatus(row: Row, status: string) {
    const { error } = await client.from("donation_confirmations").update({ status }).eq("id", row.id);
    if (error) return toast.error(error.message);
    setRows((r) => (r ?? []).map((x) => (x.id === row.id ? { ...x, status } : x)));
    toast.success("Status diperbarui");
  }

  async function remove(row: Row) {
    if (!confirm("Hapus konfirmasi donasi ini?")) return;
    const { error } = await client.from("donation_confirmations").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Dihapus");
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Konfirmasi Donasi</h1>
        <p className="mt-1 text-sm text-muted-foreground">Verifikasi konfirmasi donasi yang dikirim melalui halaman donasi.</p>
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Donatur</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Bukti</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows === null ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((__, j) => <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>)}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">Belum ada konfirmasi donasi.</TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(row.created_at).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{row.name}</div>
                  {row.message && <div className="max-w-[220px] truncate text-xs text-muted-foreground">{row.message}</div>}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">{row.phone}</TableCell>
                <TableCell className="whitespace-nowrap font-semibold">
                  Rp {Number(row.amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-sm">{METHODS[row.payment_method] ?? row.payment_method}</TableCell>
                <TableCell>
                  {row.proof_image ? (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setProof(row.proof_image)}>
                      <ImageIcon className="h-3.5 w-3.5" /> Lihat
                    </Button>
                  ) : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>{statusBadge(row.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      value={row.status}
                      onChange={(e) => setStatus(row, e.target.value)}
                      className="h-9 rounded-md border bg-background px-2 text-xs"
                      aria-label="Ubah status"
                    >
                      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <Button variant="ghost" size="icon" onClick={() => remove(row)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!proof} onOpenChange={(o) => !o && setProof(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Bukti Transfer</DialogTitle></DialogHeader>
          {proof && <SafeImage src={proof} alt="Bukti transfer" loading="eager" className="h-auto w-full rounded-lg object-contain" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/donation-confirmations")({
  component: ConfirmationsPage,
});
