import type { PolicyConfig } from "./types";

/**
 * Helper to define policies with good type inference.
 *
 * Example:
 *   export const policies = definePolicies({
 *     admin: { can: "*" },
 *     viewer: { can: ["user.view"] },
 *   });
 */
export function definePolicies<T extends PolicyConfig>(config: T): T {
  return config;
}
