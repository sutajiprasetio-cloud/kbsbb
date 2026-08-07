import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useRef } from "react";
import { useMediaUrl } from "@/components/safe-image";

/**
 * In-editor view for an image node.
 * The stored `src` points at the private `media` bucket, so it is resolved to a
 * signed URL for display only — the document value never changes.
 */
function ImageView({ node, selected, updateAttributes }: NodeViewProps) {
  const attrs = node.attrs as Record<string, any>;
  const url = useMediaUrl(attrs.src);
  const frame = useRef<HTMLDivElement>(null);
  const align: string = attrs.align || "center";

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const el = frame.current;
    const parentWidth = el?.parentElement?.offsetWidth ?? 1;
    const startX = e.clientX;
    const startW = el?.querySelector("img")?.offsetWidth ?? parentWidth;

    function move(ev: MouseEvent) {
      const next = Math.max(60, Math.min(parentWidth, startW + (ev.clientX - startX)));
      updateAttributes({ width: `${Math.round((next / parentWidth) * 100)}%` });
    }
    function up() {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  return (
    <NodeViewWrapper
      as="figure"
      ref={frame}
      data-align={align}
      className={`rt-figure rt-align-${align} not-prose my-4`}
      style={{ textAlign: align as any }}
    >
      <span className="relative inline-block max-w-full align-bottom">
        <img
          src={url}
          alt={attrs.alt || attrs.caption || ""}
          draggable={false}
          style={{ width: attrs.width || undefined }}
          className={`inline-block max-w-full rounded-xl ${selected ? "outline outline-2 outline-primary" : ""}`}
        />
        {selected && (
          <span
            role="presentation"
            onMouseDown={startResize}
            title="Tarik untuk mengubah ukuran"
            className="absolute bottom-1 right-1 h-4 w-4 cursor-nwse-resize rounded-sm border-2 border-background bg-primary"
          />
        )}
      </span>
      {attrs.caption && (
        <figcaption className="mt-2 text-[0.8125rem] opacity-70">{attrs.caption}</figcaption>
      )}
    </NodeViewWrapper>
  );
}

/**
 * Image node with width (resize), alignment and caption support.
 * Serialises to a <figure> so captions and alignment survive a save/reload.
 */
export const RichImage = Image.extend({
  name: "image",
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-width") ||
          (el as HTMLImageElement).style?.width ||
          el.querySelector?.("img")?.style.width ||
          null,
        renderHTML: (attrs: Record<string, any>) =>
          attrs.width ? { "data-width": attrs.width } : {},
      },
      align: {
        default: "center",
        parseHTML: (el: HTMLElement) => el.getAttribute("data-align") || "center",
        renderHTML: (attrs: Record<string, any>) => ({ "data-align": attrs.align || "center" }),
      },
      caption: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-caption") || el.querySelector?.("figcaption")?.textContent || null,
        renderHTML: (attrs: Record<string, any>) =>
          attrs.caption ? { "data-caption": attrs.caption } : {},
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "figure",
        priority: 60,
        getAttrs: (el) => {
          const node = el as HTMLElement;
          const img = node.querySelector("img");
          if (!img) return false;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            width: node.getAttribute("data-width") || img.style.width || null,
            align: node.getAttribute("data-align") || "center",
            caption: node.querySelector("figcaption")?.textContent || null,
          };
        },
      },
      { tag: "img[src]" },
    ];
  },
  renderHTML({ node }) {
    const attrs = node.attrs as Record<string, any>;
    const align = attrs.align || "center";
    const img: any[] = [
      "img",
      {
        src: attrs.src,
        alt: attrs.alt || attrs.caption || "",
        ...(attrs.width ? { style: `width:${attrs.width}` } : {}),
        loading: "lazy",
        decoding: "async",
      },
    ];
    const figureAttrs = {
      class: `rt-figure rt-align-${align}`,
      "data-align": align,
      ...(attrs.width ? { "data-width": attrs.width } : {}),
      ...(attrs.caption ? { "data-caption": attrs.caption } : {}),
    };
    if (attrs.caption) {
      return ["figure", figureAttrs, img, ["figcaption", {}, attrs.caption]];
    }
    return ["figure", figureAttrs, img];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

export default RichImage;
