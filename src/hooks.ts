import { useAccess } from "./AccessContext";
import type { Permission, CanMode } from "./types";

/**
 * Hook to check permissions directly.
 *
 * Example:
 *   const canEdit = useCan("user.edit");
 *   const canViewOrEdit = useCan(["user.view", "user.edit"], "any");
 */
export function useCan(
  permissionOrList: Permission | Permission[],
  mode?: CanMode
): boolean {
  const { can } = useAccess();
  return can(permissionOrList, { mode });
}
