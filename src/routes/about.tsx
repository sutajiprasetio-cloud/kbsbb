import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  beforeLoad: () => { throw redirect({ to: "/tentang-kami", statusCode: 301 }); },
  component: () => null,
});
