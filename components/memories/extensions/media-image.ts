import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MediaImageView } from "../node-views/media-image-view";

export const MediaImage = Node.create({
  name: "mediaImage",

  group: "block",

  atom: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      mediaId: {
        default: null,

        parseHTML: (element) => element.getAttribute("data-media-id"),

        renderHTML: (attributes) => {
          if (!attributes.mediaId) {
            return {};
          }

          return {
            "data-media-id": attributes.mediaId,
          };
        },
      },

      src: {
        default: null,

        parseHTML: (element) => element.getAttribute("src"),

        renderHTML: (attributes) => {
          if (!attributes.src) {
            return {};
          }

          return {
            src: attributes.src,
          };
        },
      },

      alt: {
        default: "",

        parseHTML: (element) => element.getAttribute("alt") ?? "",

        renderHTML: (attributes) => ({
          alt: attributes.alt ?? "",
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[data-media-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaImageView);
  },
});
