import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/contact")({
  component: () => (
    <CrudPage
      title="Contact messages"
      table="contact_messages"
      searchFields={["name", "email", "subject"]}
      orderBy={{ column: "created_at", ascending: false }}
      columns={[
        { name: "name", label: "Name" },
        { name: "email", label: "Email" },
        { name: "subject", label: "Subject" },
        { name: "status", label: "Status" },
        { name: "created_at", label: "Received" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "text", required: true },
        { name: "subject", label: "Subject", type: "text", span: 2 },
        { name: "message", label: "Message", type: "textarea", required: true, span: 2 },
        { name: "status", label: "Status", type: "select", options: [
          { label: "New", value: "new" },
          { label: "Read", value: "read" },
          { label: "Replied", value: "replied" },
          { label: "Archived", value: "archived" },
        ]},
      ]}
    />
  ),
});
