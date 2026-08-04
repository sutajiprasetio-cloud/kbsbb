import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Palette, RotateCcw } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";
import { SafeImage } from "@/components/safe-image";
import defaultLogo from "@/assets/logo.png";
import { DEFAULT_BRANDING, normalizeBranding, type Branding } from "@/lib/branding";

const IMAGE_FIELDS: { name: keyof Branding; label: string; help: string; className?: string }[] = [
  { name: "logo_header", label: "Logo Header", help: "Tampil pada navbar di seluruh halaman. Disarankan PNG transparan, rasio 1:1." },
  { name: "logo_footer", label: "Logo Footer", help: "Tampil pada footer website. Bisa berbeda dengan logo header." },
  { name: "favicon", label: "Favicon", help: "Ikon pada tab browser. Disarankan ukuran 64×64 px." },
];

function Preview({ value, size }: { value: string; size: string }) {
  return (
    <div className="mt-2 inline-flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
      {value ? (
        <SafeImage src={value} alt="Pratinjau" className={`${size} rounded object-contain`} />
      ) : (
        <img src={defaultLogo} alt="Logo default" className={`${size} rounded object-contain`} />
      )}
      <span className="text-xs text-muted-foreground">{value ? "Pratinjau" : "Belum ada gambar — memakai logo default"}</span>
    </div>
  );
}

function BrandingPage() {
  const [values, setValues] = useState<Branding>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("key, value").in("key", ["branding", "general"]);
      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value ?? {}; });
      setValues(normalizeBranding(map.branding, map.general));
      setLoading(false);
    })();
  }, []);

  const set = (k: keyof Branding, v: string) => setValues((p) => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "branding", value: values as any }, { onConflict: "key" });
    // Keep legacy `general` keys in sync so older readers show the same logo.
    if (!error) {
      const { data: gen } = await supabase.from("site_settings").select("value").eq("key", "general").maybeSingle();
      await supabase.from("site_settings").upsert(
        {
          key: "general",
          value: {
            ...(((gen as any)?.value as any) ?? {}),
            logo_url: values.logo_header,
            favicon_url: values.favicon,
            site_name: values.site_name,
            tagline: values.tagline,
          } as any,
        },
        { onConflict: "key" },
      );
    }
    setSaving(false);
    if (error) return toast.error(error.message);
    window.dispatchEvent(new CustomEvent("kbsbb-branding-updated"));
    toast.success("Branding disimpan");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Branding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Atur logo, favicon, dan identitas website. Perubahan langsung tampil di navbar, footer, dan tab browser.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Memuat…</div>
      ) : (
        <>
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-brand" />
              <h2 className="font-semibold">Logo & Favicon</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {IMAGE_FIELDS.map((f) => (
                <div key={f.name} className="space-y-2">
                  <Label>{f.label}</Label>
                  <MediaPicker value={values[f.name]} onChange={(v) => set(f.name, v)} />
                  <p className="text-xs text-muted-foreground">{f.help}</p>
                  <Preview value={values[f.name]} size={f.name === "favicon" ? "h-8 w-8" : "h-12 w-12"} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-semibold">Identitas Website</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nama Website</Label>
                <Input value={values.site_name} onChange={(e) => set("site_name", e.target.value)} placeholder="KBSBB" />
              </div>
              <div className="space-y-2">
                <Label>Tagline Website</Label>
                <Input value={values.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Komunitas Berbagi Sehat · Berbagi Berkah" />
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setValues(DEFAULT_BRANDING)}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset ke Default
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan Pengaturan
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/branding")({
  component: BrandingPage,
});
