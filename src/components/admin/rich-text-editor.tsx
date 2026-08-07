import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, ListChecks,
  Quote, Minus, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link2, Link2Off, ImagePlus, Table as TableIcon, Code2, Eye, Loader2, Highlighter,
  Rows3, Columns3, Trash2, Combine, Youtube, Braces, IndentIncrease, IndentDecrease,
} from "lucide-react";
import { toast } from "sonner";
import { RichImage } from "./rich-image";
import { RichEmbed, toEmbedSrc } from "./rich-embed";
import { RichText } from "@/components/rich-text";

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px", "48px"];
const TEXT_COLORS = ["#111827", "#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#0284c7", "#4f46e5", "#9333ea"];
const HIGHLIGHTS = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#e9d5ff", "#fed7aa"];


export function sanitizeHtml(html: string) {
  if (typeof window === "undefined") return html;
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "rel", "data-align", "data-width", "data-caption", "colspan", "rowspan", "style"],
    ADD_TAGS: ["figure", "figcaption"],
  });
}

async function uploadToMedia(file: File) {
  const ext = file.name.split(".").pop();
  const path = `content/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function Tb({
  onClick, active, disabled, title, children,
}: { onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={!!active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-2 text-sm transition-colors disabled:opacity-40 ${
        active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  storageKey,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  storageKey?: string;
  placeholder?: string;
}) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [html, setHtml] = useState(value || "");
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkBlank, setLinkBlank] = useState(true);
  const [imgOpen, setImgOpen] = useState(false);
  const [imgAlt, setImgAlt] = useState("");
  const [imgCaption, setImgCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const lastSaved = useRef(value || "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } },
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      TextStyleKit.configure({ fontSize: {}, color: {} }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TableKit.configure({ table: { resizable: true } }),
      RichImage.configure({ allowBase64: false }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[260px] px-4 py-3 dark:prose-invert",
      },
      handleDrop: (_view, event) => {
        const files = Array.from((event as DragEvent).dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (!files.length) return false;
        event.preventDefault();
        void insertFiles(files);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
        if (!files.length) return false;
        event.preventDefault();
        void insertFiles(files);
        return true;
      },
    },
    onUpdate: ({ editor: ed }) => {
      const out = ed.getHTML();
      setHtml(out);
      onChange(out === "<p></p>" ? "" : out);
    },
  });

  const insertFiles = useCallback(
    async (files: File[]) => {
      if (!editor) return;
      setUploading(true);
      try {
        for (const file of files) {
          const url = await uploadToMedia(file);
          editor
            .chain()
            .focus()
            .setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") } as any)
            .run();
        }
        toast.success(files.length > 1 ? `${files.length} gambar diunggah` : "Gambar diunggah");
      } catch (e: any) {
        toast.error(e.message ?? "Gagal mengunggah gambar");
      } finally {
        setUploading(false);
      }
    },
    [editor],
  );

  // keep editor in sync when the parent record changes (e.g. opening another row)
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    if (incoming !== editor.getHTML() && incoming !== html) {
      editor.commands.setContent(incoming, { emitUpdate: false });
      setHtml(incoming);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  // Auto save draft every 30s
  useEffect(() => {
    if (!storageKey) return;
    const id = setInterval(() => {
      const current = html;
      if (!current || current === lastSaved.current) return;
      try {
        localStorage.setItem(`kbsbb-draft:${storageKey}`, current);
        lastSaved.current = current;
        toast.success("Draft tersimpan", { duration: 1500 });
      } catch {
        /* ignore quota errors */
      }
    }, 30000);
    return () => clearInterval(id);
  }, [html, storageKey]);

  const selectedImage = editor?.isActive("image");

  function applyHtml(next: string) {
    const clean = sanitizeHtml(next);
    setHtml(clean);
    onChange(clean);
    editor?.commands.setContent(clean, { emitUpdate: false });
  }

  function openLink() {
    if (!editor) return;
    setLinkUrl(editor.getAttributes("link").href ?? "");
    setLinkBlank((editor.getAttributes("link").target ?? "_blank") === "_blank");
    setLinkOpen(true);
  }

  function saveLink() {
    if (!editor) return;
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({
          href: linkUrl.trim(),
          target: linkBlank ? "_blank" : null,
          rel: linkBlank ? "noopener noreferrer" : null,
        } as any)
        .run();
    }
    setLinkOpen(false);
  }

  function openImageSettings() {
    if (!editor) return;
    const a = editor.getAttributes("image");
    setImgAlt(a.alt ?? "");
    setImgCaption(a.caption ?? "");
    setImgOpen(true);
  }

  function setImageAttr(attrs: Record<string, any>) {
    editor?.chain().focus().updateAttributes("image", attrs).run();
  }

  const toolbarDisabled = mode === "html";

  return (
    <div className="rounded-lg border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2">
        <Tb title="Undo" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></Tb>
        <Tb title="Redo" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></Tb>
        <Separator orientation="vertical" className="mx-1 h-6" />

        <select
          aria-label="Gaya paragraf"
          disabled={toolbarDisabled}
          value={
            [1, 2, 3, 4, 5, 6].find((l) => editor?.isActive("heading", { level: l }))?.toString() ?? "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor?.chain().focus().setParagraph().run();
            else editor?.chain().focus().toggleHeading({ level: Number(v) as any }).run();
          }}
          className="h-8 rounded-md border bg-background px-2 text-sm"
        >
          <option value="p">Paragraf</option>
          {[1, 2, 3, 4, 5, 6].map((l) => <option key={l} value={l}>{`Heading ${l}`}</option>)}
        </select>

        <select
          aria-label="Ukuran font"
          disabled={toolbarDisabled}
          value={editor?.getAttributes("textStyle").fontSize ?? ""}
          onChange={(e) =>
            e.target.value
              ? editor?.chain().focus().setFontSize(e.target.value).run()
              : editor?.chain().focus().unsetFontSize().run()
          }
          className="h-8 rounded-md border bg-background px-2 text-sm"
        >
          <option value="">Ukuran</option>
          {FONT_SIZES.map((s) => <option key={s} value={s}>{s.replace("px", "")}</option>)}
        </select>

        <Separator orientation="vertical" className="mx-1 h-6" />
        <Tb title="Bold" active={editor?.isActive("bold")} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Tb>
        <Tb title="Italic" active={editor?.isActive("italic")} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Tb>
        <Tb title="Underline" active={editor?.isActive("underline")} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></Tb>
        <Tb title="Strikethrough" active={editor?.isActive("strike")} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></Tb>

        <ColorMenu
          title="Warna teks"
          disabled={toolbarDisabled}
          colors={TEXT_COLORS}
          onPick={(c) => editor?.chain().focus().setColor(c).run()}
          onClear={() => editor?.chain().focus().unsetColor().run()}
          icon={<span className="text-sm font-semibold">A</span>}
        />
        <ColorMenu
          title="Warna sorot"
          disabled={toolbarDisabled}
          colors={HIGHLIGHTS}
          onPick={(c) => editor?.chain().focus().setHighlight({ color: c }).run()}
          onClear={() => editor?.chain().focus().unsetHighlight().run()}
          icon={<Highlighter className="h-4 w-4" />}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />
        <Tb title="Rata kiri" active={editor?.isActive({ textAlign: "left" })} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().setTextAlign("left").run()}><AlignLeft className="h-4 w-4" /></Tb>
        <Tb title="Rata tengah" active={editor?.isActive({ textAlign: "center" })} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().setTextAlign("center").run()}><AlignCenter className="h-4 w-4" /></Tb>
        <Tb title="Rata kanan" active={editor?.isActive({ textAlign: "right" })} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().setTextAlign("right").run()}><AlignRight className="h-4 w-4" /></Tb>
        <Tb title="Rata kiri-kanan" active={editor?.isActive({ textAlign: "justify" })} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().setTextAlign("justify").run()}><AlignJustify className="h-4 w-4" /></Tb>

        <Separator orientation="vertical" className="mx-1 h-6" />
        <Tb title="Bullet list" active={editor?.isActive("bulletList")} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Tb>
        <Tb title="Numbered list" active={editor?.isActive("orderedList")} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Tb>
        <Tb title="Checklist" active={editor?.isActive("taskList")} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleTaskList().run()}><ListChecks className="h-4 w-4" /></Tb>
        <Tb title="Kutipan" active={editor?.isActive("blockquote")} disabled={toolbarDisabled} onClick={() => editor?.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Tb>
        <Tb title="Garis horizontal" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></Tb>

        <Separator orientation="vertical" className="mx-1 h-6" />
        <Tb title="Tautan" active={editor?.isActive("link")} disabled={toolbarDisabled} onClick={openLink}><Link2 className="h-4 w-4" /></Tb>
        <Tb title="Hapus tautan" disabled={toolbarDisabled || !editor?.isActive("link")} onClick={() => editor?.chain().focus().unsetLink().run()}><Link2Off className="h-4 w-4" /></Tb>
        <Tb title="Sisipkan gambar" disabled={toolbarDisabled || uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </Tb>
        <Tb title="Sisipkan tabel" disabled={toolbarDisabled} onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="h-4 w-4" /></Tb>

        <div className="ml-auto flex items-center gap-1">
          <Tb title="Pratinjau" onClick={() => setPreview(true)}><Eye className="h-4 w-4" /><span className="hidden sm:inline">Pratinjau</span></Tb>
          <Tb
            title={mode === "visual" ? "Mode HTML" : "Mode Visual"}
            active={mode === "html"}
            onClick={() => {
              if (mode === "visual") { setHtml(editor?.getHTML() ?? ""); setMode("html"); }
              else { applyHtml(html); setMode("visual"); }
            }}
          >
            <Code2 className="h-4 w-4" /><span className="hidden sm:inline">{mode === "visual" ? "HTML" : "Visual"}</span>
          </Tb>
        </div>
      </div>

      {/* Table tools */}
      {editor?.isActive("table") && mode === "visual" && (
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/20 p-2 text-xs">
          <Tb title="Tambah baris" onClick={() => editor.chain().focus().addRowAfter().run()}><Rows3 className="h-4 w-4" />+Baris</Tb>
          <Tb title="Hapus baris" onClick={() => editor.chain().focus().deleteRow().run()}><Rows3 className="h-4 w-4" />-Baris</Tb>
          <Tb title="Tambah kolom" onClick={() => editor.chain().focus().addColumnAfter().run()}><Columns3 className="h-4 w-4" />+Kolom</Tb>
          <Tb title="Hapus kolom" onClick={() => editor.chain().focus().deleteColumn().run()}><Columns3 className="h-4 w-4" />-Kolom</Tb>
          <Tb title="Gabung / pisah sel" onClick={() => editor.chain().focus().mergeOrSplit().run()}><Combine className="h-4 w-4" />Merge</Tb>
          <Tb title="Header baris" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>Header</Tb>
          <Tb title="Hapus tabel" onClick={() => editor.chain().focus().deleteTable().run()}><Trash2 className="h-4 w-4" /></Tb>
        </div>
      )}

      {/* Image tools */}
      {selectedImage && mode === "visual" && (
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/20 p-2 text-xs">
          <span className="px-1 text-muted-foreground">Gambar:</span>
          <Tb title="Rata kiri" onClick={() => setImageAttr({ align: "left" })}><AlignLeft className="h-4 w-4" /></Tb>
          <Tb title="Rata tengah" onClick={() => setImageAttr({ align: "center" })}><AlignCenter className="h-4 w-4" /></Tb>
          <Tb title="Rata kanan" onClick={() => setImageAttr({ align: "right" })}><AlignRight className="h-4 w-4" /></Tb>
          {["25%", "50%", "75%", "100%"].map((w) => (
            <Tb key={w} title={`Lebar ${w}`} onClick={() => setImageAttr({ width: w })}>{w}</Tb>
          ))}
          <Tb title="Alt text & caption" onClick={openImageSettings}>Alt / Caption</Tb>
          <Tb title="Hapus gambar" onClick={() => editor?.chain().focus().deleteSelection().run()}><Trash2 className="h-4 w-4" /></Tb>
        </div>
      )}

      {mode === "visual" ? (
        <EditorContent editor={editor} className="rt-editor" />
      ) : (
        <Textarea
          value={html}
          onChange={(e) => { setHtml(e.target.value); onChange(e.target.value); }}
          rows={16}
          spellCheck={false}
          className="rounded-none border-0 font-mono text-xs focus-visible:ring-0"
          placeholder="<p>Tulis HTML di sini…</p>"
        />
      )}

      {!html && placeholder && mode === "visual" && (
        <p className="pointer-events-none -mt-10 px-4 pb-4 text-sm text-muted-foreground">{placeholder}</p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) void insertFiles(files);
          e.target.value = "";
        }}
      />

      {/* Link dialog */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tautan</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="rt-link">URL</Label>
              <Input id="rt-link" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={linkBlank} onChange={(e) => setLinkBlank(e.target.checked)} />
              Buka di tab baru
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkOpen(false)}>Batal</Button>
            <Button onClick={saveLink}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image alt/caption dialog */}
      <Dialog open={imgOpen} onOpenChange={setImgOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Keterangan Gambar</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="rt-alt">Alt text (SEO)</Label>
              <Input id="rt-alt" value={imgAlt} onChange={(e) => setImgAlt(e.target.value)} placeholder="Deskripsi singkat gambar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt-cap">Caption</Label>
              <Input id="rt-cap" value={imgCaption} onChange={(e) => setImgCaption(e.target.value)} placeholder="Teks di bawah gambar" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImgOpen(false)}>Batal</Button>
            <Button onClick={() => { setImageAttr({ alt: imgAlt || imgCaption, caption: imgCaption || null }); setImgOpen(false); }}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader><DialogTitle>Pratinjau konten</DialogTitle></DialogHeader>
          <RichText html={html} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ColorMenu({
  title, colors, onPick, onClear, icon, disabled,
}: {
  title: string; colors: string[]; onPick: (c: string) => void; onClear: () => void; icon: React.ReactNode; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div className="relative" ref={wrap}>
      <Tb title={title} disabled={disabled} onClick={() => setOpen((o) => !o)}>{icon}</Tb>
      {open && (
        <div className="absolute z-50 mt-1 w-40 rounded-md border bg-popover p-2 shadow-md">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onPick(c); setOpen(false); }}
                className="h-6 w-6 rounded border"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { onClear(); setOpen(false); }}
            className="mt-2 w-full rounded px-2 py-1 text-xs hover:bg-muted"
          >
            Hapus warna
          </button>
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;
