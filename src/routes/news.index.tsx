import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/")({
  beforeLoad: () => { throw redirect({ to: "/berita", statusCode: 301 }); },
  component: () => null,
});
