import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/faq")({
  component: () => (
    <CrudPage
      title="FAQ"
      table="faqs"
      searchFields={["question", "category"]}
      orderBy={{ column: "sort_order", ascending: true }}
      defaultValues={{ is_active: true, sort_order: 0 }}
      columns={[
        { name: "question", label: "Question" },
        { name: "category", label: "Category" },
        { name: "sort_order", label: "Order" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "question", label: "Question", type: "text", required: true, span: 2 },
        { name: "answer", label: "Answer", type: "textarea", required: true, span: 2 },
        { name: "category", label: "Category", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
