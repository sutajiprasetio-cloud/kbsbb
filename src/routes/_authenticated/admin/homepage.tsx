import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GripVertical, Loader2, RotateCcw, Save, LayoutTemplate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  DEFAULT_ENABLED, DEFAULT_ORDER, HOMEPAGE_SECTIONS, normalizeConfig, serializeConfig,
  type HomepageConfig, type SectionId,
} from "@/lib/homepage-config";

const META = Object.fromEntries(HOMEPAGE_SECTIONS.map((s) => [s.id, s]));

function HomepageSectionsPage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<SectionId | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "homepage").maybeSingle();
      setConfig(normalizeConfig((data as any)?.value));
    })();
  }, []);

  function toggle(id: SectionId) {
    setConfig((c) => (c ? { ...c, enabled: { ...c.enabled, [id]: !c.enabled[id] } } : c));
  }

  function onDrop(target: SectionId) {
    if (!config || !dragId || dragId === target) return;
    const list = [...config.order];
    const from = list.indexOf(dragId);
    const to = list.indexOf(target);
    if (from < 0 || to < 0) return;
    list.splice(to, 0, list.splice(from, 1)[0]);
    setDragId(null);
    setConfig({ ...config, order: list });
  }

  function move(id: SectionId, dir: -1 | 1) {
    if (!config) return;
    const list = [...config.order];
    const i = list.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    setConfig({ ...config, order: list });
  }

  function resetDefault() {
    setConfig({ order: [...DEFAULT_ORDER], enabled: { ...DEFAULT_ENABLED } });
    toast.info("Dikembalikan ke default. Klik Simpan Pengaturan untuk menerapkan.");
  }

  async function save() {
    if (!config) return;
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ key: "homepage", value: serializeConfig(config) });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Pengaturan beranda tersimpan");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold tracking-tight">
            <LayoutTemplate className="h-6 w-6 text-brand" /> Homepage
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Atur section mana saja yang tampil di halaman Beranda dan urutannya. Section yang dinonaktifkan tidak
            dirender sama sekali, namun seluruh datanya tetap tersimpan. Menu navigasi/navbar tidak terpengaruh.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetDefault} disabled={!config}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset ke Default
          </Button>
          <Button onClick={save} disabled={!config || saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Pengaturan
          </Button>
        </div>
      </div>

      <Card className="divide-y p-0">
        {!config ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : (
          config.order.map((id, index) => {
            const meta = META[id];
            const on = config.enabled[id];
            return (
              <div
                key={id}
                draggable
                onDragStart={() => setDragId(id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(id)}
                className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${dragId === id ? "opacity-50" : ""}`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="mt-0.5 cursor-grab text-muted-foreground active:cursor-grabbing" aria-hidden>
                    <GripVertical className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{index + 1}.</span>
                      <span className="font-semibold">{meta.label}</span>
                      <Badge variant={on ? "default" : "secondary"}>{on ? "Aktif" : "Nonaktif"}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{meta.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button variant="ghost" size="sm" onClick={() => move(id, -1)} disabled={index === 0} aria-label="Naik">↑</Button>
                  <Button variant="ghost" size="sm" onClick={() => move(id, 1)} disabled={index === config.order.length - 1} aria-label="Turun">↓</Button>
                  <Switch checked={on} onCheckedChange={() => toggle(id)} aria-label={`Aktifkan ${meta.label}`} />
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: HomepageSectionsPage,
});
