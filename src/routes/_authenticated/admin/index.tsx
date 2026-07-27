import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Heart, Users, HandHeart, FileText, Activity, Calendar, Megaphone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

type Stats = {
  donationsTotal: number;
  donationsCount: number;
  donors: number;
  volunteers: number;
  programs: number;
  campaigns: number;
};

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [donations, volunteers, programs, campaigns, activityRes] = await Promise.all([
        (supabase as any).from("donations").select("amount, donor_email", { count: "exact" }).eq("status", "confirmed"),
        (supabase as any).from("volunteers").select("id", { count: "exact", head: true }),
        (supabase as any).from("programs").select("id", { count: "exact", head: true }).eq("is_active", true),
        (supabase as any).from("donation_campaigns").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("activity_log").select("id, action, entity, created_at, user_id").order("created_at", { ascending: false }).limit(8),
      ]);
      const total = (donations.data ?? []).reduce((s: number, d: any) => s + Number(d.amount || 0), 0);
      const donors = new Set((donations.data ?? []).map((d: any) => d.donor_email).filter(Boolean)).size;
      setActivity(activityRes.data ?? []);
      setStats({
        donationsTotal: total,
        donationsCount: donations.count ?? 0,
        donors,
        volunteers: volunteers.count ?? 0,
        programs: programs.count ?? 0,
        campaigns: campaigns.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back. Here's what's happening at KBSBB.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Heart} label="Total donations" value={stats ? `Rp ${stats.donationsTotal.toLocaleString()}` : null} sub={stats ? `${stats.donationsCount} transactions` : null} tone="brand" />
        <StatCard icon={Users} label="Donors" value={stats?.donors ?? null} tone="ocean" />
        <StatCard icon={HandHeart} label="Volunteers" value={stats?.volunteers ?? null} tone="brand" />
        <StatCard icon={FileText} label="Programs" value={stats?.programs ?? null} tone="ocean" />
        <StatCard icon={Megaphone} label="Active campaigns" value={stats?.campaigns ?? null} tone="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-brand" />
            <h2 className="font-semibold">Latest news</h2>
          </div>
          <EmptyState
            title="No news yet"
            body="Content modules ship in Phase 2 — you'll manage news, programs, events, and more from here."
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-ocean" />
            <h2 className="font-semibold">Recent activity</h2>
          </div>
          {activity.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nothing yet.</div>
          ) : (
            <ul className="space-y-3 text-sm">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-brand shrink-0" />
                  <div>
                    <div className="font-medium">{a.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.entity ?? "system"} · {new Date(a.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-brand" />
          <h2 className="font-semibold">What's next</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Phase 1 (auth + admin shell) is live. Reply "next" to me in chat and I'll build Phase 2:
          full CRUD for Hero Slider, Programs, News, Events, Gallery, Testimonials, Partners,
          Team, FAQ, About, Vision &amp; Mission, and Contact — with search + pagination — and
          wire every public page to the database.
        </p>
        <div className="mt-4">
          <Link to="/" className="text-sm text-brand hover:underline font-medium">← View public site</Link>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone }: { icon: any; label: string; value: number | string | null; sub?: string | null; tone: "brand" | "ocean" }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-bold">
            {value === null ? <Skeleton className="h-7 w-24" /> : value}
          </div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone === "brand" ? "bg-brand-soft text-brand" : "bg-ocean-soft text-ocean"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{body}</div>
    </div>
  );
}
