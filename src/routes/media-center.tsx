import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";

const TABS = [
  { to: "/media-center", label: "Semua" },
  { to: "/media-center/foto", label: "Foto" },
  { to: "/media-center/video", label: "Video" },
  { to: "/media-center/dokumen", label: "Dokumen" },
];

export const Route = createFileRoute("/media-center")({
  component: MediaCenterLayout,
});

function MediaCenterLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <SiteLayout>
      <PageHero eyebrow="Media Center" title="Pusat Media KBSBB" description="Foto, video, dan dokumen resmi kegiatan kemanusiaan KBSBB." />
      <section className="container-x py-16">
        <Breadcrumbs className="mb-6" items={[{ label: "Media Center", to: "/media-center" }]} />
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = pathname === t.to || (t.to === "/media-center" && pathname === "/media-center/");
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? "gradient-brand text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
        <div className="mt-10"><Outlet /></div>
      </section>
    </SiteLayout>
  );
}
