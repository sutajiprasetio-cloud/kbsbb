import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: () => (
    <CrudPage
      title="Gallery"
      description="Photos from programs and events."
      table="gallery_items"
      searchFields={["title", "category"]}
      orderBy={{ column: "sort_order", ascending: true }}
      defaultValues={{ display_mode: "cover",  sort_order: 0 }}
      columns={[
        { name: "image_url", label: "Image" },
        { name: "title", label: "Title" },
        { name: "category", label: "Category" },
        { name: "sort_order", label: "Order" },
      ]}
      fields={[
        { name: "image_url", label: "Image", type: "image", required: true, span: 2 },
        { name: "display_mode", label: "Mode Tampilan Gambar", type: "display_mode", span: 2, previewField: "image_url" },
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug URL (opsional — dibuat otomatis)", type: "text", placeholder: "kegiatan-bakti-sosial" },
        { name: "category", label: "Category", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  ),
});
