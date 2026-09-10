import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MediaVideoView } from "../node-views/media-video-view";

export const MediaVideo = Node.create({
  name: "mediaVideo",

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
    };
  },

  parseHTML() {
    return [
      {
        tag: "video[data-media-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: true,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaVideoView);
  },
});
