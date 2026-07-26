import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — KBSBB Frequently Asked Questions" },
      { name: "description", content: "Answers to common questions about donating, volunteering, and partnering with KBSBB." },
      { property: "og:title", content: "KBSBB FAQ" },
      { property: "og:description", content: "Everything you need to know." },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  const items = useTable<any>("faqs", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="FAQ" title="Answers to your questions" />
      <section className="container-x py-20 max-w-3xl">
        {items && items.length === 0 ? (
          <EmptyState title="No questions yet" description="We're putting our FAQ together. In the meantime, reach out through the contact page." />
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {(items ?? []).map((it: any, i: number) => (
              <AccordionItem key={it.id} value={`item-${i}`} className="border-b border-border">
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold py-5">{it.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">{it.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>
    </SiteLayout>
  );
}
