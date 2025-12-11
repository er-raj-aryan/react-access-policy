import React from "react";
import type { CanProps } from "./types";
import { useCan } from "./hooks";

/**
 * Declarative permission gate for React components.
 *
 * <Can I="user.edit">
 *   <button>Edit</button>
 * </Can>
 *
 * <Can I={["user.edit", "user.view"]} mode="any">
 *   <button>View or Edit</button>
 * </Can>
 *
 * <Can I="user.delete" fallback={null}>
 *   <DangerZone />
 * </Can>
 */
export const Can: React.FC<CanProps> = ({ I, mode, children, fallback = null }) => {
  const allowed = useCan(I, mode);

  // Render prop: children is a function receiving "allowed"
  if (typeof children === "function") {
    const rendered = children(allowed);
    if (!allowed && fallback != null) {
      return <>{fallback}</>;
    }
    return <>{rendered}</>;
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
