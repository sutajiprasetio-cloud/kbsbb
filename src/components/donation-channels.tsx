import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings, useTable } from "@/lib/public-data";
import { useMediaUrl, SafeImage } from "@/components/safe-image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Copy, Check, Download, Maximize2, QrCode, Loader2, Upload, HeartHandshake } from "lucide-react";
import { toast } from "sonner";

type Bank = {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  note?: string | null;
};

export function DonationChannels() {
  const banks = useTable<Bank>("bank_accounts", {
    filter: (q) => q.eq("is_active", true),
    order: { column: "sort_order", ascending: true },
  });
  const settings = useSettings();
  const qris = settings.qris ?? {};
  const qrisActive = qris.image_url && qris.enabled !== false && qris.enabled !== "false";

  return (
    <section id="metode-donasi" className="container-x py-16 md:py-20">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Pilih Metode Donasi</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Salurkan donasi Anda melalui transfer bank atau QRIS, lalu kirim konfirmasi agar tim kami dapat memverifikasi.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Transfer Bank</h3>
            </div>

            {banks === null ? (
              <div className="mt-6 space-y-3">
                {[0, 1].map((i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}
              </div>
            ) : banks.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">Belum ada rekening donasi yang tersedia.</p>
            ) : (
              <ul className="mt-6 space-y-3">
                {banks.map((b) => <BankRow key={b.id} bank={b} />)}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-white">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Donasi Melalui QRIS</h3>
            </div>
            {qrisActive ? (
              <QrisBox src={qris.image_url} note={qris.note} />
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">QRIS belum tersedia saat ini.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <ConfirmationForm />
      </div>
    </section>
  );
}

function BankRow({ bank }: { bank: Bank }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(bank.account_number);
      setCopied(true);
      toast.success("Nomor rekening disalin");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Gagal menyalin nomor rekening");
    }
  }
  return (
    <li className="rounded-2xl border border-border/70 bg-muted/30 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-bold uppercase tracking-wide text-primary">{bank.bank_name}</div>
          <div className="mt-1 text-xl font-extrabold tracking-tight">{bank.account_number}</div>
          <div className="text-sm text-muted-foreground">a.n. {bank.account_holder}</div>
          {bank.note && <div className="mt-1 text-xs text-muted-foreground">{bank.note}</div>}
        </div>
        <Button type="button" variant="outline" size="sm" className="rounded-full gap-2" onClick={copy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Salin
        </Button>
      </div>
    </li>
  );
}

function QrisBox({ src, note }: { src: string; note?: string }) {
  const url = useMediaUrl(src);
  const [zoom, setZoom] = useState(false);

  async function download() {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "qris-kbsbb.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch {
      window.open(url, "_blank", "noreferrer");
    }
  }

  return (
    <div className="mt-6">
      <div className="mx-auto max-w-xs rounded-2xl border border-border/70 bg-white p-4">
        <SafeImage src={src} alt="Kode QRIS KBSBB" className="h-auto w-full rounded-xl object-contain" />
      </div>
      {note && <p className="mt-3 text-center text-xs text-muted-foreground">{note}</p>}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button type="button" variant="outline" className="rounded-full gap-2" onClick={() => setZoom(true)}>
          <Maximize2 className="h-4 w-4" /> Perbesar QRIS
        </Button>
        <Button type="button" className="rounded-full gap-2" onClick={download}>
          <Download className="h-4 w-4" /> Download QRIS
        </Button>
      </div>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Kode QRIS KBSBB</DialogTitle></DialogHeader>
          <div className="rounded-2xl bg-white p-4">
            <SafeImage src={src} alt="Kode QRIS KBSBB diperbesar" className="h-auto w-full object-contain" loading="eager" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function ConfirmationForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", phone: "", amount: "", payment_method: "transfer", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  function pick(f?: File | null) {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) return toast.error("Format harus JPG, JPEG, PNG, atau WEBP.");
    if (f.size > 5 * 1024 * 1024) return toast.error("Ukuran file maksimal 5 MB.");
    setFile(f);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const amount = Number(String(form.amount).replace(/[^\d]/g, ""));
    if (name.length < 2 || name.length > 100) return toast.error("Nama donatur wajib diisi (maks. 100 karakter).");
    if (!/^0\d{8,14}$|^62\d{8,14}$/.test(phone)) return toast.error("Nomor WhatsApp tidak valid. Contoh: 08123456789");
    if (!amount || amount < 1000) return toast.error("Nominal donasi minimal Rp 1.000.");
    if (form.message.length > 500) return toast.error("Pesan maksimal 500 karakter.");

    setBusy(true);
    try {
      let proof: string | null = null;
      if (file) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `donation-proofs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        proof = path;
      }
      const { error } = await (supabase as any).from("donation_confirmations").insert({
        name,
        phone,
        amount,
        payment_method: form.payment_method,
        message: form.message.trim() || null,
        proof_image: proof,
      });
      if (error) throw error;
      setDone(true);
      setForm({ name: "", phone: "", amount: "", payment_method: "transfer", message: "" });
      setFile(null);
      toast.success("Konfirmasi donasi terkirim. Terima kasih!");
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal mengirim konfirmasi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card id="konfirmasi-donasi" className="rounded-3xl border-border/70 shadow-soft">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-white">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Konfirmasi Donasi</h3>
            <p className="text-sm text-muted-foreground">Sudah berdonasi? Kirim konfirmasi agar donasi Anda segera kami verifikasi.</p>
          </div>
        </div>

        {done ? (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-brand-soft p-6 text-center">
            <p className="font-semibold">Terima kasih atas kebaikan Anda 🤍</p>
            <p className="mt-1 text-sm text-muted-foreground">Konfirmasi donasi Anda telah kami terima dan akan diverifikasi oleh tim KBSBB.</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => setDone(false)}>Kirim konfirmasi lagi</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dc-name">Nama Donatur</Label>
              <Input id="dc-name" value={form.name} maxLength={100} onChange={(e) => set("name", e.target.value)} placeholder="Nama Lengkap" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dc-phone">Nomor WhatsApp</Label>
              <Input id="dc-phone" value={form.phone} maxLength={20} inputMode="numeric" onChange={(e) => set("phone", e.target.value)} placeholder="08xxxxxxxxxx" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dc-amount">Nominal Donasi (Rp)</Label>
              <Input id="dc-amount" value={form.amount} inputMode="numeric" onChange={(e) => set("amount", e.target.value.replace(/[^\d]/g, ""))} placeholder="100000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dc-method">Metode Donasi</Label>
              <select
                id="dc-method"
                value={form.payment_method}
                onChange={(e) => set("payment_method", e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="transfer">Transfer Bank</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dc-message">Pesan / Doa (opsional)</Label>
              <Textarea id="dc-message" value={form.message} maxLength={500} rows={3} onChange={(e) => set("message", e.target.value)} placeholder="Semoga menjadi berkah…" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Upload Bukti Transfer</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="outline" className="rounded-full gap-2" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Pilih Gambar
                </Button>
                <span className="text-sm text-muted-foreground">{file ? file.name : "JPG, JPEG, PNG, atau WEBP (maks. 5 MB)"}</span>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={busy} className="w-full rounded-full gap-2 md:w-auto">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Kirim Konfirmasi Donasi
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
