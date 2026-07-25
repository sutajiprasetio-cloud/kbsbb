import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/donation-categories")({
  component: () => (
    <CrudPage
      title="Donation categories"
      table="donation_categories"
      searchFields={["name", "slug"]}
      orderBy={{ column: "name", ascending: true }}
      defaultValues={{ is_active: true }}
      columns={[
        { name: "name", label: "Name" },
        { name: "slug", label: "Slug" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", span: 2 },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
