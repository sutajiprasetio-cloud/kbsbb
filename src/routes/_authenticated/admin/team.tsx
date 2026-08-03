import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: () => (
    <CrudPage
      title="Team"
      table="team_members"
      searchFields={["name", "role"]}
      orderBy={{ column: "sort_order", ascending: true }}
      defaultValues={{ display_mode: "cover",  is_active: true, sort_order: 0 }}
      columns={[
        { name: "photo_url", label: "Photo" },
        { name: "name", label: "Name" },
        { name: "role", label: "Role" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text" },
        { name: "bio", label: "Bio", type: "textarea", span: 2 },
        { name: "photo_url", label: "Photo", type: "image", span: 2 },
        { name: "display_mode", label: "Mode Tampilan Gambar", type: "display_mode", span: 2, previewField: "photo_url" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
