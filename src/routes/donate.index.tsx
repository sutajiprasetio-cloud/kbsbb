import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/donate/")({
  beforeLoad: () => { throw redirect({ to: "/donasi", statusCode: 301 }); },
  component: () => null,
});
