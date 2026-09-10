"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

export function MediaVideoView({ node, selected }: NodeViewProps) {
  const src = node.attrs.src as string | null;

  if (!src) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed bg-muted/40">
          <span className="text-sm text-muted-foreground">
            Video unavailable
          </span>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-5">
      <div
        className={[
          "overflow-hidden rounded-xl border bg-black",
          selected ? "ring-2 ring-primary ring-offset-2" : "",
        ].join(" ")}
      >
        <video
          src={src}
          controls
          preload="metadata"
          className="block max-h-[600px] w-full"
        />
      </div>
    </NodeViewWrapper>
  );
}
