import type { ReactNode } from "react";

export type RoleName = string;
export type Permission = string;

/**
 * A single role policy.
 */
export interface RolePolicy {
  /**
   * Permissions this role grants.
   * Use "*" to say "this role can do everything".
   */
  can: Permission[] | "*";

  /**
   * Other roles this role inherits permissions from.
   * Example: "manager" can inherit from "viewer".
   */
  inherits?: RoleName[];
}

/**
 * Top-level policy config:
 * Each key is a role name.
 */
export type PolicyConfig = Record<RoleName, RolePolicy>;

/**
 * How multiple permissions should be checked.
 * - "all" (default): require all permissions to be granted
 * - "any": require at least one permission to be granted
 */
export type CanMode = "any" | "all";

export interface CanCheckOptions {
  mode?: CanMode;
}

/**
 * Value stored in React context.
 */
export interface AccessContextValue {
  roles: RoleName[];
  can: (permissionOrList: Permission | Permission[], options?: CanCheckOptions) => boolean;
}

/**
 * Props for AccessProvider.
 */
export interface AccessProviderProps {
  policies: PolicyConfig;
  roles: RoleName[];
  children: ReactNode;
}

/**
 * Props for <Can /> component.
 */
export interface CanProps {
  /**
   * Permission or list of permissions to check.
   */
  I: Permission | Permission[];

  /**
   * "all" (default): must have all permissions
   * "any": must have at least one permission
   */
  mode?: CanMode;

  /**
   * Children can be:
   * - ReactNode (will only render if allowed)
   * - function (allowed => ReactNode)
   */
  children: ReactNode | ((allowed: boolean) => ReactNode);

  /**
   * Optional fallback when not allowed.
   */
  fallback?: ReactNode;
}
