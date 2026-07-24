import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

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
  return (
    <SiteLayout>
      <PageHero eyebrow="Contact" title="Let's talk" description="Questions, partnerships, media — we'd love to hear from you." />
      <section className="container-x py-20 grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="space-y-4">
          {[
            { icon: MapPin, t: "Office", v: "Jl. Merdeka No. 88, Jakarta Pusat 10110" },
            { icon: Phone, t: "Phone", v: "+62 812 3456 7890" },
            { icon: Mail, t: "Email", v: "hello@kbsbb.org" },
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
            <iframe title="Map" src="https://www.google.com/maps?q=Monas+Jakarta&output=embed" className="h-full w-full" loading="lazy" />
          </div>
        </div>
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-2xl font-extrabold">Send us a message</h3>
            <form className="mt-6 grid gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Name</Label><Input required /></div>
                <div className="grid gap-1.5"><Label>Email</Label><Input type="email" required /></div>
              </div>
              <div className="grid gap-1.5"><Label>Subject</Label><Input required /></div>
              <div className="grid gap-1.5"><Label>Message</Label><Textarea rows={6} required /></div>
              <Button size="lg" className="rounded-full">Send message</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
