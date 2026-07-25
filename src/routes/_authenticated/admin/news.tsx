import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/news")({
  component: () => (
    <CrudPage
      title="News"
      description="Articles and updates."
      table="news_posts"
      searchFields={["title", "slug", "author"]}
      orderBy={{ column: "published_at", ascending: false }}
      defaultValues={{ is_published: false, tags: [] }}
      columns={[
        { name: "cover_url", label: "Cover" },
        { name: "title", label: "Title" },
        { name: "author", label: "Author" },
        { name: "published_at", label: "Published" },
        { name: "is_published", label: "Live" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, span: 2 },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "author", label: "Author", type: "text" },
        { name: "excerpt", label: "Excerpt", type: "textarea", span: 2 },
        { name: "content", label: "Content (markdown)", type: "textarea", span: 2 },
        { name: "cover_url", label: "Cover image", type: "image", span: 2 },
        { name: "tags", label: "Tags (comma separated)", type: "tags", span: 2 },
        { name: "published_at", label: "Publish at", type: "datetime" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
