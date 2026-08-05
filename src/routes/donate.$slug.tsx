import { createFileRoute, redirect } from "@tanstack/react-router";
import { normalizeSlug } from "@/lib/slug";

export const Route = createFileRoute("/donate/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/donasi/$slug", params: { slug: normalizeSlug(params.slug) }, statusCode: 301 });
  },
  component: () => null,
});
