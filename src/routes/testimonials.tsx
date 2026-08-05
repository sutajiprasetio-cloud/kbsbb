import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/testimonials")({
  beforeLoad: () => { throw redirect({ to: "/testimoni", statusCode: 301 }); },
  component: () => null,
});
