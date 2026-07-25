import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/programs")({
  component: () => (
    <CrudPage
      title="Programs"
      description="Humanitarian programs shown on the site."
      table="programs"
      searchFields={["title", "slug", "summary"]}
      orderBy={{ column: "sort_order", ascending: true }}
      defaultValues={{ is_active: true, sort_order: 0 }}
      columns={[
        { name: "image_url", label: "Image" },
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "sort_order", label: "Order" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, placeholder: "kesehatan" },
        { name: "summary", label: "Summary", type: "textarea", span: 2 },
        { name: "description", label: "Description", type: "textarea", span: 2 },
        { name: "image_url", label: "Image", type: "image", span: 2 },
        { name: "icon", label: "Icon (lucide name)", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
