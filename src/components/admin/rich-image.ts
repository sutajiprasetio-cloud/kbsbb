import Image from "@tiptap/extension-image";

/**
 * Image node with width (resize), alignment and caption support.
 * Serialises to a <figure> when a caption exists, otherwise a plain <img>.
 */
export const RichImage = Image.extend({
  name: "image",
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-width") || el.style.width || null,
        renderHTML: (attrs: Record<string, any>) =>
          attrs.width ? { "data-width": attrs.width, style: `width:${attrs.width}` } : {},
      },
      align: {
        default: "center",
        parseHTML: (el: HTMLElement) => el.getAttribute("data-align") || "center",
        renderHTML: (attrs: Record<string, any>) => ({ "data-align": attrs.align || "center" }),
      },
      caption: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-caption"),
        renderHTML: (attrs: Record<string, any>) =>
          attrs.caption ? { "data-caption": attrs.caption } : {},
      },
    };
  },
  parseHTML() {
    return [
      { tag: "img[src]" },
      {
        tag: "figure",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          const img = node.querySelector("img");
          if (!img) return false;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            width: node.getAttribute("data-width") || img.style.width || null,
            align: node.getAttribute("data-align") || "center",
            caption: node.querySelector("figcaption")?.textContent || null,
          };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    const attrs = node.attrs as Record<string, any>;
    const align = attrs.align || "center";
    const style = attrs.width ? `width:${attrs.width}` : "";
    const img: any[] = [
      "img",
      {
        src: attrs.src,
        alt: attrs.alt || attrs.caption || "",
        style,
        loading: "lazy",
      },
    ];
    const figureAttrs = {
      class: `rt-figure rt-align-${align}`,
      "data-align": align,
      ...(attrs.width ? { "data-width": attrs.width } : {}),
    };
    if (attrs.caption) {
      return ["figure", figureAttrs, img, ["figcaption", {}, attrs.caption]];
    }
    return ["figure", figureAttrs, img];
  },
});

export default RichImage;
