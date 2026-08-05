import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/partners")({
  beforeLoad: () => { throw redirect({ to: "/mitra", statusCode: 301 }); },
  component: () => null,
});
