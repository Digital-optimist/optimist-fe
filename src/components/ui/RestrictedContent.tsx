"use client";

import type { ReactNode, SyntheticEvent } from "react";

function handleRestrictedAction(event: SyntheticEvent) {
  event.preventDefault();
}

export function RestrictedContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      onCopy={handleRestrictedAction}
      onCut={handleRestrictedAction}
      onContextMenu={handleRestrictedAction}
      onDragStart={handleRestrictedAction}
    >
      {children}
    </div>
  );
}
