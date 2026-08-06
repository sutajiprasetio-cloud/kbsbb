import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: () => (
    <CrudPage
      title="Testimonials"
      table="testimonials"
      searchFields={["name", "role"]}
      orderBy={{ column: "sort_order", ascending: true }}
      defaultValues={{ display_mode: "cover",  is_active: true, rating: 5, sort_order: 0 }}
      columns={[
        { name: "avatar_url", label: "Avatar" },
        { name: "name", label: "Name" },
        { name: "role", label: "Role" },
        { name: "rating", label: "Rating" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text" },
        { name: "quote", label: "Quote", type: "richtext", required: true, span: 2 },
        { name: "avatar_url", label: "Avatar", type: "image", span: 2 },
        { name: "display_mode", label: "Mode Tampilan Gambar", type: "display_mode", span: 2, previewField: "avatar_url" },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
