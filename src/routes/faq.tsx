import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const ITEMS = [
  { q: "Is KBSBB a registered foundation?", a: "Yes. KBSBB (Yayasan Komunitas Berbagi Sehat Berbagi Berkah) is a legally registered non-profit in Indonesia with full audit compliance since 2011." },
  { q: "Where does my donation go?", a: "100% of public donations reach the field. Our operational costs are covered separately by institutional partners and endowment income." },
  { q: "Can I get a tax deduction receipt?", a: "Yes — KBSBB is registered for donor tax receipts. You will receive an official receipt by email within 3 business days." },
  { q: "How do I become a volunteer?", a: "Head to the Volunteer page and submit an application. We onboard new batches every quarter." },
  { q: "Do you accept international donations?", a: "Yes. We accept international bank transfers and PayPal. Contact us for details." },
  { q: "Can my company partner with KBSBB?", a: "Absolutely. We work with corporates on CSR programs, employee volunteering and campaign sponsorship. Reach us via the Partners page." },
  { q: "Is my personal data safe?", a: "Yes. We follow Indonesian data protection standards and never share your data with third parties." },
  { q: "How do I cancel my monthly donation?", a: "One click in your donor dashboard, or email us and we'll process it within 24 hours." },
];

function FAQ() {
  return (
    <SiteLayout>
      <PageHero eyebrow="FAQ" title="Answers to your questions" />
      <section className="container-x py-20 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {ITEMS.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold py-5">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}
