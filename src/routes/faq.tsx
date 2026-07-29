import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Tanya Jawab — Pertanyaan Umum KBSBB" },
      { name: "description", content: "Jawaban atas pertanyaan umum seputar donasi, menjadi relawan, dan kemitraan bersama KBSBB." },
      { property: "og:title", content: "Tanya Jawab KBSBB" },
      { property: "og:description", content: "Semua yang perlu Anda ketahui." },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  const items = useTable<any>("faqs", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Tanya Jawab" title="Jawaban atas pertanyaan Anda" />
      <section className="container-x py-20 max-w-3xl">
        {items && items.length === 0 ? (
          <EmptyState title="Belum ada pertanyaan" description="Daftar tanya jawab sedang kami susun. Sementara itu, silakan hubungi kami melalui halaman kontak." />
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
