import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/components/admin/media-picker";
import { Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";

type Qris = { image_url?: string; note?: string; enabled?: boolean };

function QrisPage() {
  const [value, setValue] = useState<Qris>({ image_url: "", note: "", enabled: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "qris").maybeSingle();
      if (data?.value) setValue({ enabled: true, ...(data.value as Qris) });
      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ key: "qris", value: value as any });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Pengaturan QRIS tersimpan");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">QRIS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Unggah atau ganti kode QRIS yang tampil di halaman donasi. Jika dinonaktifkan, section QRIS tidak ditampilkan namun gambarnya tetap tersimpan.
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <QrCode className="h-4 w-4 text-brand" />
          <h2 className="font-semibold">Kode QRIS</h2>
        </div>
        {loading ? (
          <div className="text-sm text-muted-foreground">Memuat…</div>
        ) : (
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Gambar QRIS</Label>
              <MediaPicker value={value.image_url ?? ""} onChange={(v) => setValue({ ...value, image_url: v })} />
            </div>
            <div className="space-y-2">
              <Label>Keterangan (opsional)</Label>
              <Input
                value={value.note ?? ""}
                onChange={(e) => setValue({ ...value, note: e.target.value })}
                placeholder="Scan menggunakan aplikasi mobile banking atau e-wallet Anda"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex h-10 items-center gap-2">
                <Switch checked={value.enabled !== false} onCheckedChange={(c) => setValue({ ...value, enabled: c })} />
                <span className="text-sm text-muted-foreground">{value.enabled !== false ? "Aktif" : "Nonaktif"}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={save} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/qris")({
  component: QrisPage,
});
