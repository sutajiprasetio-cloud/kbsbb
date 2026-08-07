import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

/** Converts a YouTube / Vimeo / direct URL into an embeddable iframe src. */
export function toEmbedSrc(input: string): string | null {
  const url = (input || "").trim();
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (/^https?:\/\//i.test(url)) return url;
  return null;
}

function EmbedView({ node, selected }: NodeViewProps) {
  const src = (node.attrs as any).src as string;
  return (
    <NodeViewWrapper
      className={`rt-embed not-prose my-4 ${selected ? "outline outline-2 outline-primary rounded-xl" : ""}`}
      data-type="embed"
    >
      <iframe
        src={src}
        title="Video"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </NodeViewWrapper>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    richEmbed: {
      setEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

/** Responsive video / iframe embed node. */
export const RichEmbed = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [
      { tag: 'div[data-type="embed"]', getAttrs: (el) => ({ src: (el as HTMLElement).querySelector("iframe")?.getAttribute("src") }) },
      { tag: "iframe[src]", getAttrs: (el) => ({ src: (el as HTMLElement).getAttribute("src") }) },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "rt-embed", "data-type": "embed" },
      [
        "iframe",
        mergeAttributes(
          {
            src: HTMLAttributes.src,
            title: "Video",
            loading: "lazy",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: "true",
            frameborder: "0",
          },
        ),
      ],
    ];
  },
  addCommands() {
    return {
      setEmbed:
        (options) =>
        ({ commands }) => {
          const src = toEmbedSrc(options.src);
          if (!src) return false;
          return commands.insertContent({ type: this.name, attrs: { src } });
        },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(EmbedView);
  },
});

export default RichEmbed;
