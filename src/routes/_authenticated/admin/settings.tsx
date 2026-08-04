import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Globe, Share2, Mail, Map, Search, MessageCircle } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";
import { Switch } from "@/components/ui/switch";

type Group = { key: string; icon: any; title: string; fields: { name: string; label: string; kind?: "text" | "textarea" | "image" | "boolean"; help?: string }[] };

const GROUPS: Group[] = [

  {
    key: "whatsapp", icon: MessageCircle, title: "WhatsApp",
    fields: [
      { name: "number", label: "Nomor WhatsApp", help: "Format internasional tanpa tanda +, contoh: 628xxxxxxxxxx" },
      { name: "admin_name", label: "Nama Admin", help: "Ditampilkan pada tooltip tombol WhatsApp. Contoh: Admin KBSBB" },
      { name: "default_message", label: "Pesan Default", kind: "textarea" },
      {
        name: "enabled",
        label: "Tombol WhatsApp Mengambang",
        kind: "boolean",
        help: "Jika dinonaktifkan, tombol WhatsApp tidak ditampilkan di seluruh halaman website.",
      },
    ],
  },
  {
    key: "social", icon: Share2, title: "Social media",
    fields: [
      { name: "facebook", label: "Facebook URL" },
      { name: "instagram", label: "Instagram URL" },
      { name: "twitter", label: "X / Twitter URL" },
      { name: "youtube", label: "YouTube URL" },
      { name: "whatsapp", label: "WhatsApp number (E.164, e.g. 6281234567890)" },
    ],
  },
  {
    key: "email", icon: Mail, title: "Email",
    fields: [
      { name: "contact_email", label: "Contact email" },
      { name: "notify_email", label: "Notifications inbox" },
    ],
  },
  {
    key: "maps", icon: Map, title: "Google Maps",
    fields: [
      { name: "address", label: "Address", kind: "textarea" },
      { name: "map_embed_url", label: "Google Maps embed URL", kind: "textarea" },
    ],
  },
  {
    key: "seo", icon: Search, title: "SEO",
    fields: [
      { name: "meta_title", label: "Default meta title" },
      { name: "meta_description", label: "Default meta description", kind: "textarea" },
      { name: "og_image", label: "Default OG image", kind: "image" },
    ],
  },
];

function SettingsPage() {
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value ?? {}; });
      setValues(map);
      setLoading(false);
    })();
  }, []);

  async function save(key: string) {
    setSaving(key);
    const { error } = await supabase.from("site_settings").upsert({ key, value: values[key] ?? {} });
    setSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Website-wide configuration.</p>
      </div>
      {loading ? <div className="text-sm text-muted-foreground">Loading...</div> : GROUPS.map((g) => (
        <Card key={g.key} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <g.icon className="h-4 w-4 text-brand" />
            <h2 className="font-semibold">{g.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {g.fields.map((f) => {
              const v = values[g.key]?.[f.name] ?? "";
              const set = (nv: string) => setValues({ ...values, [g.key]: { ...(values[g.key] ?? {}), [f.name]: nv } });
              return (
                <div key={f.name} className={`space-y-2 ${f.kind === "textarea" || f.kind === "image" ? "md:col-span-2" : ""}`}>
                  <Label>{f.label}</Label>
                  {f.kind === "boolean" ? (
                    <div className="flex h-10 items-center gap-2">
                      <Switch checked={(v as any) !== false && v !== "false"} onCheckedChange={(c) => set(c as any)} />
                      <span className="text-sm text-muted-foreground">{(v as any) !== false && v !== "false" ? "Aktif" : "Nonaktif"}</span>
                    </div>
                  ) : f.kind === "textarea" ? (
                    <Textarea value={v} onChange={(e) => set(e.target.value)} rows={3} />
                  ) : f.kind === "image" ? (
                    <MediaPicker value={v} onChange={set} />
                  ) : (
                    <Input value={v} onChange={(e) => set(e.target.value)} />
                  )}
                  {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => save(g.key)} disabled={saving === g.key}>
              {saving === g.key && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save {g.title}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});
