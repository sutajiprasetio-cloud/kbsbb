import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, Heart, Sparkles, Handshake } from "lucide-react";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer with KBSBB" },
      { name: "description", content: "Become a KBSBB volunteer. Join 3,400+ Indonesians serving communities across 34 provinces." },
      { property: "og:title", content: "Volunteer with KBSBB" },
      { property: "og:description", content: "Give your time. Change a life." },
    ],
  }),
  component: Volunteer,
});

const PERKS = [
  { icon: Users, title: "Meaningful community", text: "Join a family of 3,400+ volunteers across Indonesia." },
  { icon: Sparkles, title: "Real training", text: "Field readiness, first aid, and leadership programs." },
  { icon: Heart, title: "Direct impact", text: "See the change you make in every deployment." },
  { icon: Handshake, title: "Career growth", text: "Certificates, references, and lifelong networks." },
];

function Volunteer() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Volunteer" title="Give your time. Change a life." description="Whether you have an hour a week or a whole weekend, there's a place for you." />
      <section className="container-x py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Why join us</h2>
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
            <h3 className="text-2xl font-extrabold">Apply now</h3>
            <p className="mt-2 text-sm text-muted-foreground">We'll get back within 3–5 days.</p>
            <form className="mt-6 grid gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Full name</Label><Input required /></div>
                <div className="grid gap-1.5"><Label>Age</Label><Input type="number" min={17} required /></div>
              </div>
              <div className="grid gap-1.5"><Label>Email</Label><Input type="email" required /></div>
              <div className="grid gap-1.5"><Label>Phone (WhatsApp)</Label><Input required /></div>
              <div className="grid gap-1.5"><Label>City</Label><Input required /></div>
              <div className="grid gap-1.5"><Label>Why do you want to volunteer?</Label><Textarea rows={4} /></div>
              <Button type="submit" size="lg" className="rounded-full">Submit application</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
