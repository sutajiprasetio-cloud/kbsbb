import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery")({
  beforeLoad: () => { throw redirect({ to: "/dokumentasi", statusCode: 301 }); },
  component: () => null,
});
