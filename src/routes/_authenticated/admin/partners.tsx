import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/partners")({
  component: () => (
    <CrudPage
      title="Partners"
      table="partners"
      searchFields={["name"]}
      orderBy={{ column: "sort_order", ascending: true }}
      defaultValues={{ is_active: true, sort_order: 0 }}
      columns={[
        { name: "logo_url", label: "Logo" },
        { name: "name", label: "Name" },
        { name: "website", label: "Website" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "website", label: "Website", type: "text" },
        { name: "logo_url", label: "Logo", type: "image", span: 2 },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
