import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/programs")({
  beforeLoad: () => { throw redirect({ to: "/program", statusCode: 301 }); },
  component: () => null,
});
