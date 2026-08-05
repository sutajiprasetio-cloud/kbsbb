import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/events")({
  beforeLoad: () => { throw redirect({ to: "/event", statusCode: 301 }); },
  component: () => null,
});
