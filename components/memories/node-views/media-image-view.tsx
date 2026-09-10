"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

export function MediaImageView({ node, selected }: NodeViewProps) {
  const src = node.attrs.src as string | null;
  const alt = node.attrs.alt as string;

  if (!src) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed bg-muted/40">
          <span className="text-sm text-muted-foreground">
            Image unavailable
          </span>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-5">
      <div
        className={[
          "group relative overflow-hidden rounded-xl border bg-muted/20",
          selected ? "ring-2 ring-primary ring-offset-2" : "",
        ].join(" ")}
      >
        <img
          src={src}
          alt={alt}
          className="block max-h-[600px] w-full object-contain"
        />
      </div>
    </NodeViewWrapper>
  );
}
