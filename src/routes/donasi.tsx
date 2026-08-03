import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/donasi")({
  beforeLoad: () => {
    throw redirect({ to: "/donate" });
  },
  component: () => null,
});
