import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/events")({
  component: () => (
    <CrudPage
      title="Events"
      description="Upcoming and past events."
      table="events"
      searchFields={["title", "location"]}
      orderBy={{ column: "starts_at", ascending: false }}
      defaultValues={{ display_mode: "cover",  is_published: true }}
      columns={[
        { name: "image_url", label: "Image" },
        { name: "title", label: "Title" },
        { name: "location", label: "Location" },
        { name: "starts_at", label: "Starts" },
        { name: "is_published", label: "Live" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, span: 2 },
        { name: "slug", label: "Slug URL (opsional — dibuat otomatis dari judul)", type: "text", span: 2, placeholder: "aksi-donor-darah-jakarta" },
        { name: "description", label: "Description", type: "richtext", span: 2 },
        { name: "location", label: "Location", type: "text", span: 2 },
        { name: "starts_at", label: "Starts at", type: "datetime", required: true },
        { name: "ends_at", label: "Ends at", type: "datetime" },
        { name: "image_url", label: "Image", type: "image", span: 2 },
        { name: "display_mode", label: "Mode Tampilan Gambar", type: "display_mode", span: 2, previewField: "image_url" },
        { name: "cta_href", label: "CTA link", type: "text", span: 2 },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
