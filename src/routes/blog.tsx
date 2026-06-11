import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — SettleInValencia" },
      {
        name: "description",
        content:
          "Field-tested guides on Valencia neighborhoods, visas, taxes and integration — written for newcomers.",
      },
      { property: "og:title", content: "Blog — SettleInValencia" },
      {
        property: "og:description",
        content: "Valencia relocation insights.",
      },
    ],
  }),
  component: () => <Outlet />,
});
