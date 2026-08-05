import { createFileRoute, redirect } from "@tanstack/react-router";
import { normalizeSlug } from "@/lib/slug";

export const Route = createFileRoute("/news/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/berita/$slug", params: { slug: normalizeSlug(params.slug) }, statusCode: 301 });
  },
  component: () => null,
});
