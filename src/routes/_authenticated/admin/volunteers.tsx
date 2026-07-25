import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/volunteers")({
  component: () => (
    <CrudPage
      title="Volunteer applications"
      description="People who signed up to help."
      table="volunteers"
      searchFields={["name", "email", "city"]}
      orderBy={{ column: "created_at", ascending: false }}
      columns={[
        { name: "name", label: "Name" },
        { name: "email", label: "Email" },
        { name: "city", label: "City" },
        { name: "status", label: "Status" },
        { name: "created_at", label: "Received" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "text", required: true },
        { name: "phone", label: "Phone", type: "text" },
        { name: "city", label: "City", type: "text" },
        { name: "skills", label: "Skills", type: "textarea", span: 2 },
        { name: "message", label: "Message", type: "textarea", span: 2 },
        { name: "status", label: "Status", type: "select", options: [
          { label: "New", value: "new" },
          { label: "Contacted", value: "contacted" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
        ]},
      ]}
    />
  ),
});
