import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SafeImage } from "@/components/safe-image";

export function MediaPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const isVideo = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i.test(value ?? "");

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="https://... atau unggah gambar/video" />
        <Button type="button" variant="outline" onClick={() => ref.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}><X className="h-4 w-4" /></Button>
        )}
        <input ref={ref} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </div>
      {value && /^https?:\/\//.test(value) && (
        isVideo ? (
          <video src={value} muted playsInline controls className="h-24 rounded border object-cover" />
        ) : (
          <SafeImage src={value} alt="preview" className="h-24 rounded border object-cover" />
        )
      )}
    </div>
  );
}

