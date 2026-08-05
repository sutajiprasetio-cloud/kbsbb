import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/lib/public-data";
import { toast } from "sonner";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak KBSBB" },
      { name: "description", content: "Hubungi tim KBSBB — alamat kantor, telepon, email, dan formulir kontak." },
      { property: "og:title", content: "Kontak KBSBB" },
      { property: "og:description", content: "Kami senang mendengar kabar dari Anda." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const settings = useSettings();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Pesan terkirim — kami akan segera membalas Anda.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  const address = settings.maps?.address ?? "Pekanbaru";
  const email = settings.email?.contact_email ?? "hello@kbsbb.org";
  const phone = settings.social?.whatsapp ? `+${settings.social.whatsapp}` : "+62 853 6508 9475";
  const embed = settings.maps?.map_embed_url ?? "https://www.google.com/maps?q=Monas+Jakarta&output=embed";

  return (
    <SiteLayout>
      <PageHero eyebrow="Kontak" title="Hubungi Kami" description="Bersama kita dapat memperluas manfaat dan menghadirkan lebih banyak kebaikan dan keberkahan" />
      <section className="container-x py-20 grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="space-y-4">
          {[
            { icon: MapPin, t: "Kantor", v: address },
            { icon: Phone, t: "Telepon", v: phone },
            { icon: Mail, t: "Email", v: email },
            { icon: Clock, t: "Jam Operasional", v: "Senin–Jumat, 09.00 – 17.00 WIB" },
          ].map((c) => (
            <Card key={c.t} className="rounded-3xl border-border/70">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-brand text-white"><c.icon className="h-5 w-5" /></div>
                <div><div className="text-xs uppercase tracking-widest text-muted-foreground">{c.t}</div><div className="mt-0.5 font-semibold">{c.v}</div></div>
              </CardContent>
            </Card>
          ))}
          <div className="rounded-3xl overflow-hidden border border-border aspect-video">
            <iframe title="Peta" src={embed} className="h-full w-full" loading="lazy" />
          </div>
        </div>
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-2xl font-extrabold">Kirim pesan kepada kami</h3>
            <form className="mt-6 grid gap-4" onSubmit={submit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Nama</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div className="grid gap-1.5"><Label>Subjek</Label><Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label>Pesan</Label><Textarea rows={6} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
              <Button size="lg" className="rounded-full" disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Kirim Pesan
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
