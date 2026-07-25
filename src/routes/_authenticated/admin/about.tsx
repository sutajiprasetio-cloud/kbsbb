import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/_authenticated/admin/about")({
  component: () => (
    <CrudPage
      singleton
      singletonId={1}
      title="About / Vision & Mission"
      description="The content shown on your About page."
      table="about_content"
      columns={[]}
      fields={[
        { name: "headline", label: "Headline", type: "text", span: 2 },
        { name: "intro", label: "Intro paragraph", type: "textarea", span: 2 },
        { name: "story", label: "Our story", type: "textarea", span: 2 },
        { name: "vision", label: "Vision", type: "textarea", span: 2 },
        { name: "mission", label: "Mission", type: "textarea", span: 2 },
        { name: "image_url", label: "Image", type: "image", span: 2 },
      ]}
    />
  ),
});
