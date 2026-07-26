import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — KBSBB Corporate & Institutional Allies" },
      { name: "description", content: "KBSBB partners with leading Indonesian and global institutions to deliver humanitarian impact at scale." },
      { property: "og:title", content: "KBSBB Partners" },
      { property: "og:description", content: "Trusted by leaders across sectors." },
    ],
  }),
  component: Partners,
});

function Partners() {
  const items = useTable<any>("partners", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Our Partners" title="Together we go further" description="From global institutions to local businesses — thank you for standing with the mission." />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="No partners listed yet" description="Our partner directory is being updated. Reach out if you'd like to collaborate." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(items ?? []).map((p: any) => (
              <a key={p.id} href={p.website ?? "#"} target={p.website ? "_blank" : undefined} rel="noreferrer" className="grid h-28 place-items-center rounded-3xl border border-border bg-card p-4 text-2xl font-black tracking-tight text-muted-foreground hover:text-primary hover:shadow-soft transition-all">
                {p.logo_url ? <img src={p.logo_url} alt={p.name} className="max-h-16 max-w-full object-contain" /> : p.name}
              </a>
            ))}
          </div>
        )}
        <Card className="mt-16 rounded-3xl border-border/70 gradient-brand text-white">
          <CardContent className="p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold">Become a partner</h2>
            <p className="mt-3 max-w-xl mx-auto opacity-90">CSR alignment, employee volunteering, program sponsorship — let's design impact together.</p>
            <Link to="/contact"><Button size="lg" className="mt-6 rounded-full bg-white text-primary hover:bg-white/90">Contact partnerships</Button></Link>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
