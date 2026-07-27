import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/donations")({
  component: () => (
    <CrudPage
      title="Donations"
      description="Donation records — confirm to move from pending to confirmed."
      table="donations"
      searchFields={["donor_name", "donor_email"]}
      orderBy={{ column: "created_at", ascending: false }}
      defaultValues={{ status: "pending" }}
      columns={[
        { name: "donor_name", label: "Donor", render: (r) => (r.is_anonymous ? `${r.donor_name} (anon)` : r.donor_name) },
        { name: "amount", label: "Amount", render: (r) => `Rp ${Number(r.amount).toLocaleString()}` },
        { name: "method", label: "Method" },
        { name: "status", label: "Status" },
        { name: "created_at", label: "Received" },
      ]}
      fields={[
        { name: "donor_name", label: "Donor name", type: "text", required: true },
        { name: "donor_email", label: "Donor email", type: "text" },
        { name: "donor_phone", label: "Donor phone", type: "text" },
        { name: "amount", label: "Amount (IDR)", type: "number", required: true },
        { name: "method", label: "Method", type: "text" },
        { name: "message", label: "Message / prayer", type: "textarea", span: 2 },
        { name: "note", label: "Internal note", type: "textarea", span: 2 },
        { name: "is_anonymous", label: "Anonymous donor", type: "boolean" },
        { name: "status", label: "Status", type: "select", options: [
          { label: "Pending", value: "pending" },
          { label: "Confirmed", value: "confirmed" },
          { label: "Rejected", value: "rejected" },
        ]},
        { name: "confirmed_at", label: "Confirmed at", type: "datetime" },
      ]}
    />
  ),
});
