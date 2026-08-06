import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { CrudPage } from "@/components/admin/crud-page";

function CampaignsPage() {
  return (
    <div className="space-y-8">
      <Card className="p-4 flex flex-wrap gap-2 text-sm">
        <Link to="/admin/donations" className="text-brand hover:underline">Donations →</Link>
        <span className="text-muted-foreground">·</span>
        <Link to="/admin/donation-categories" className="text-brand hover:underline">Categories →</Link>
      </Card>
      <CrudPage
        title="Donation campaigns"
        table="donation_campaigns"
        searchFields={["title", "slug"]}
        orderBy={{ column: "created_at", ascending: false }}
        defaultValues={{ display_mode: "cover",  is_active: true, goal_amount: 0, raised_amount: 0 }}
        columns={[
          { name: "cover_url", label: "Cover" },
          { name: "title", label: "Title" },
          { name: "goal_amount", label: "Goal", render: (r) => `Rp ${Number(r.goal_amount).toLocaleString()}` },
          { name: "raised_amount", label: "Raised", render: (r) => `Rp ${Number(r.raised_amount).toLocaleString()}` },
          { name: "is_active", label: "Active" },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true, span: 2 },
          { name: "slug", label: "Slug", type: "text", required: true },
          { name: "description", label: "Description", type: "richtext", span: 2 },
          { name: "cover_url", label: "Cover image", type: "image", span: 2 },
          { name: "display_mode", label: "Mode Tampilan Gambar", type: "display_mode", span: 2, previewField: "cover_url" },
          { name: "goal_amount", label: "Goal amount (IDR)", type: "number" },
          { name: "raised_amount", label: "Raised amount (IDR)", type: "number" },
          { name: "ends_at", label: "Ends at", type: "datetime" },
          { name: "is_active", label: "Active", type: "boolean" },
        ]}
      />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/campaigns")({
  component: CampaignsPage,
});
