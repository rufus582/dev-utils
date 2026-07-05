import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "#/routes/index/-layout";

export const Route = createFileRoute("/")({
  component: () => <HomePage layout="desktop" />,
  pendingComponent: () => "loading",
});
