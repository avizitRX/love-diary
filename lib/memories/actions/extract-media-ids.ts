import type { JSONContent } from "@tiptap/react";

export function extractMediaIds(document: JSONContent): string[] {
  const ids = new Set<string>();

  function walk(node: JSONContent) {
    if (
      (node.type === "mediaImage" || node.type === "mediaVideo") &&
      typeof node.attrs?.mediaId === "string"
    ) {
      ids.add(node.attrs.mediaId);
    }

    for (const child of node.content ?? []) {
      walk(child);
    }
  }

  walk(document);

  return [...ids];
}
