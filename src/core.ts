import type {
  Permission,
  RoleName,
  PolicyConfig,
  CanMode,
  CanCheckOptions,
} from "./types";

interface RoleResolution {
  wildcard: boolean;
  permissions: Set<Permission>;
}

/**
 * Build a map from role -> resolved permissions (including inheritance).
 */
function buildPermissionIndex(policies: PolicyConfig): Map<RoleName, RoleResolution> {
  const cache = new Map<RoleName, RoleResolution>();

  function resolveRole(role: RoleName, stack: Set<RoleName> = new Set()): RoleResolution {
    if (cache.has(role)) return cache.get(role)!;

    if (stack.has(role)) {
      // Circular inheritance: ignore to avoid infinite loop.
      // In a more advanced version you might want to warn.
      const empty: RoleResolution = { wildcard: false, permissions: new Set() };
      cache.set(role, empty);
      return empty;
    }

    stack.add(role);

    const def = policies[role];
    if (!def) {
      const empty: RoleResolution = { wildcard: false, permissions: new Set() };
      cache.set(role, empty);
      stack.delete(role);
      return empty;
    }

    if (def.can === "*") {
      const res: RoleResolution = { wildcard: true, permissions: new Set() };
      cache.set(role, res);
      stack.delete(role);
      return res;
    }

    const perms = new Set<Permission>(def.can ?? []);
    let wildcard = false;

    for (const parent of def.inherits ?? []) {
      const parentRes = resolveRole(parent, stack);
      if (parentRes.wildcard) {
        wildcard = true;
      }
      parentRes.permissions.forEach((p) => perms.add(p));
    }

    const res: RoleResolution = { wildcard, permissions: perms };
    cache.set(role, res);
    stack.delete(role);
    return res;
  }

  Object.keys(policies).forEach((role) => {
    resolveRole(role);
  });

  return cache;
}

/**
 * Create the "can" function for a given set of roles.
 */
export function createCanFn(
  policies: PolicyConfig,
  roles: RoleName[]
): (permissionOrList: Permission | Permission[], options?: CanCheckOptions) => boolean {
  const index = buildPermissionIndex(policies);

  let wildcard = false;
  const allowed = new Set<Permission>();

  for (const role of roles) {
    const res = index.get(role);
    if (!res) continue;

    if (res.wildcard) {
      wildcard = true;
      break;
    }

    res.permissions.forEach((p) => allowed.add(p));
  }

  const can = (
    permissionOrList: Permission | Permission[],
    options?: CanCheckOptions
  ): boolean => {
    if (wildcard) return true;

    const list = Array.isArray(permissionOrList)
      ? permissionOrList
      : [permissionOrList];

    const mode: CanMode = options?.mode ?? "all";

    if (mode === "all") {
      return list.every((p) => allowed.has(p));
    }

    // mode === "any"
    return list.some((p) => allowed.has(p));
  };

  return can;
}
