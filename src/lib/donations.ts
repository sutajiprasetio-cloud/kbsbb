import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Campaign = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  goal_amount: number;
  raised_amount: number;
  is_active: boolean;
  ends_at: string | null;
  created_at: string;
};

export type CampaignStat = { campaign_id: string; donor_count: number; confirmed_total: number };

export const rp = (n: number) => new Intl.NumberFormat("id-ID").format(Number(n || 0));

export function pct(raised: number, goal: number) {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((Number(raised) / Number(goal)) * 100));
}

/** All active campaigns + live donor counts. */
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [stats, setStats] = useState<Record<string, CampaignStat>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: rows }, { data: statRows }] = await Promise.all([
        supabase
          .from("donation_campaigns")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        (supabase as any).rpc("campaign_stats"),
      ]);
      if (cancelled) return;
      setCampaigns((rows ?? []) as Campaign[]);
      const map: Record<string, CampaignStat> = {};
      ((statRows ?? []) as CampaignStat[]).forEach((s) => { map[s.campaign_id] = s; });
      setStats(map);
    })();
    return () => { cancelled = true; };
  }, []);

  return { campaigns, stats };
}

export function useCampaign(slug: string) {
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined);
  const [stat, setStat] = useState<CampaignStat | null>(null);
  const [donors, setDonors] = useState<any[]>([]);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("donation_campaigns")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      setCampaign((data as Campaign) ?? null);
      if (!data) return;
      const [{ data: statRows }, { data: list }] = await Promise.all([
        (supabase as any).rpc("campaign_stats"),
        (supabase as any).rpc("public_donations", { _campaign_id: (data as any).id, _limit: 10 }),
      ]);
      if (cancelled) return;
      setStat(((statRows ?? []) as CampaignStat[]).find((s) => s.campaign_id === (data as any).id) ?? null);
      setDonors(list ?? []);
    })();
    return () => { cancelled = true; };
  }, [slug, tick]);

  return { campaign, stat, donors, refresh };
}
