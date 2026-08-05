import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, Heart, Sparkles, Handshake, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { canonical } from "@/lib/slug";

export const Route = createFileRoute("/relawan")({
  head: () => ({
    meta: [
      { title: "Jadi Relawan KBSBB" },
      { name: "description", content: "Bergabunglah menjadi relawan KBSBB bersama 3.400+ relawan yang melayani masyarakat di 34 provinsi." },
      { property: "og:title", content: "Jadi Relawan KBSBB" },
      { property: "og:description", content: "Berikan waktu Anda. Ubah satu kehidupan." },
      { property: "og:url", content: canonical("/relawan") },
    ],
    links: [{ rel: "canonical", href: canonical("/relawan") }],
  }),
  component: Volunteer,
});

const PERKS = [
  { icon: Users, title: "Komunitas yang bermakna", text: "Bergabung dengan keluarga 3.400+ relawan di seluruh Indonesia." },
  { icon: Sparkles, title: "Pelatihan nyata", text: "Kesiapan lapangan, pertolongan pertama, dan program kepemimpinan." },
  { icon: Heart, title: "Dampak langsung", text: "Lihat sendiri perubahan yang Anda ciptakan di setiap penugasan." },
  { icon: Handshake, title: "Pengembangan diri", text: "Sertifikat, rekomendasi, dan jejaring seumur hidup." },
];

function Volunteer() {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", skills: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("volunteers").insert(form);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Pendaftaran diterima — kami akan menghubungi Anda dalam 3–5 hari.");
    setForm({ name: "", email: "", phone: "", city: "", skills: "", message: "" });
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Relawan" title="Berikan waktu Anda. Ubah satu kehidupan." description="Baik satu jam dalam seminggu maupun satu akhir pekan penuh, selalu ada tempat untuk Anda." />
      <section className="container-x py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Mengapa bergabung</h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {PERKS.map((p) => (
              <Card key={p.title} className="rounded-2xl border-border/70">
                <CardContent className="p-5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white"><p.icon className="h-5 w-5" /></div>
                  <h3 className="mt-3 font-bold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-2xl font-extrabold">Daftar sekarang</h3>
            <p className="mt-2 text-sm text-muted-foreground">Kami akan menghubungi Anda dalam 3–5 hari.</p>
            <form className="mt-6 grid gap-4" onSubmit={submit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Nama lengkap</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div className="grid gap-1.5"><Label>Nomor telepon (WhatsApp)</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label>Kota</Label><Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label>Keahlian / pengalaman</Label><Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label>Mengapa Anda ingin menjadi relawan?</Label><Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
              <Button type="submit" size="lg" className="rounded-full" disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Kirim pendaftaran
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
