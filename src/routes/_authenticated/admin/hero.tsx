import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/hero")({
  component: () => (
    <CrudPage
      title="Hero Slider"
      description="Slide di bagian atas beranda. Media bisa berupa gambar atau video (mp4/webm). Hanya media yang wajib — judul, subjudul, dan tombol opsional. Video diputar otomatis tanpa suara dan lanjut ke slide berikutnya setelah selesai."
      table="hero_slides"
      searchFields={["title", "subtitle"]}
      orderBy={{ column: "sort_order", ascending: true }}
      defaultValues={{ is_active: true, sort_order: 0, title: "", subtitle: "", cta_label: "", cta_href: "", display_mode: "cover" }}
      columns={[
        { name: "image_url", label: "Media" },
        { name: "title", label: "Title" },
        { name: "display_mode", label: "Mode" },
        { name: "sort_order", label: "Order" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "image_url", label: "Media (Gambar / Video)", type: "image", span: 2 },
        { name: "display_mode", label: "Mode Tampilan Media", type: "display_mode", span: 2, previewField: "image_url" },

        { name: "title", label: "Title (optional)", type: "text", span: 2 },
        { name: "subtitle", label: "Subtitle (optional)", type: "textarea" },
        { name: "cta_label", label: "Button label (optional)", type: "text" },
        { name: "cta_href", label: "Button link (optional)", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
