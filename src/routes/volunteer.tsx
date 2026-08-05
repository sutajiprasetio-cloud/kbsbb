import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/volunteer")({
  beforeLoad: () => { throw redirect({ to: "/relawan", statusCode: 301 }); },
  component: () => null,
});
