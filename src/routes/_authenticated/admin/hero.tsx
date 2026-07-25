import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/hero")({
  component: () => (
    <CrudPage
      title="Hero Slider"
      description="Slides shown at the top of the homepage."
      table="hero_slides"
      searchFields={["title", "subtitle"]}
      orderBy={{ column: "sort_order", ascending: true }}
      defaultValues={{ is_active: true, sort_order: 0 }}
      columns={[
        { name: "image_url", label: "Image" },
        { name: "title", label: "Title" },
        { name: "sort_order", label: "Order" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, span: 2 },
        { name: "subtitle", label: "Subtitle", type: "textarea" },
        { name: "image_url", label: "Image", type: "image", span: 2 },
        { name: "cta_label", label: "Button label", type: "text" },
        { name: "cta_href", label: "Button link", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
