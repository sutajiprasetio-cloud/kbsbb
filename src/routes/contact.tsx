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

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact KBSBB" },
      { name: "description", content: "Reach the KBSBB team — office address, phone, email and contact form." },
      { property: "og:title", content: "Contact KBSBB" },
      { property: "og:description", content: "We'd love to hear from you." },
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
    toast.success("Message sent — we'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  const address = settings.maps?.address ?? "Jl. Merdeka No. 88, Jakarta Pusat 10110";
  const email = settings.email?.contact_email ?? "hello@kbsbb.org";
  const phone = settings.social?.whatsapp ? `+${settings.social.whatsapp}` : "+62 812 3456 7890";
  const embed = settings.maps?.map_embed_url ?? "https://www.google.com/maps?q=Monas+Jakarta&output=embed";

  return (
    <SiteLayout>
      <PageHero eyebrow="Contact" title="Let's talk" description="Questions, partnerships, media — we'd love to hear from you." />
      <section className="container-x py-20 grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="space-y-4">
          {[
            { icon: MapPin, t: "Office", v: address },
            { icon: Phone, t: "Phone", v: phone },
            { icon: Mail, t: "Email", v: email },
            { icon: Clock, t: "Hours", v: "Mon–Fri, 09:00 – 17:00 WIB" },
          ].map((c) => (
            <Card key={c.t} className="rounded-3xl border-border/70">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-brand text-white"><c.icon className="h-5 w-5" /></div>
                <div><div className="text-xs uppercase tracking-widest text-muted-foreground">{c.t}</div><div className="mt-0.5 font-semibold">{c.v}</div></div>
              </CardContent>
            </Card>
          ))}
          <div className="rounded-3xl overflow-hidden border border-border aspect-video">
            <iframe title="Map" src={embed} className="h-full w-full" loading="lazy" />
          </div>
        </div>
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-2xl font-extrabold">Send us a message</h3>
            <form className="mt-6 grid gap-4" onSubmit={submit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div className="grid gap-1.5"><Label>Subject</Label><Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label>Message</Label><Textarea rows={6} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
              <Button size="lg" className="rounded-full" disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Send message
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
