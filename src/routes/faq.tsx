import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTable } from "@/lib/public-data";

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

const FALLBACK = [
  { question: "Is KBSBB a registered foundation?", answer: "Yes. KBSBB (Yayasan Komunitas Berbagi Sehat Berbagi Berkah) is a legally registered non-profit in Indonesia with full audit compliance since 2011." },
  { question: "Where does my donation go?", answer: "100% of public donations reach the field. Our operational costs are covered separately by institutional partners and endowment income." },
  { question: "Can I get a tax deduction receipt?", answer: "Yes — KBSBB is registered for donor tax receipts. You will receive an official receipt by email within 3 business days." },
  { question: "How do I become a volunteer?", answer: "Head to the Volunteer page and submit an application. We onboard new batches every quarter." },
  { question: "Do you accept international donations?", answer: "Yes. We accept international bank transfers and PayPal. Contact us for details." },
  { question: "Can my company partner with KBSBB?", answer: "Absolutely. We work with corporates on CSR programs, employee volunteering and campaign sponsorship." },
];

function FAQ() {
  const data = useTable<any>("faqs", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  const items = data && data.length > 0 ? data : FALLBACK;
  return (
    <SiteLayout>
      <PageHero eyebrow="FAQ" title="Answers to your questions" />
      <section className="container-x py-20 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {items.map((it: any, i: number) => (
            <AccordionItem key={it.id ?? i} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold py-5">{it.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">{it.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}
