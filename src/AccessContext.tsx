import React, {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import type { AccessContextValue, AccessProviderProps } from "./types";
import { createCanFn } from "./core";

const AccessContext = createContext<AccessContextValue | undefined>(undefined);

export const AccessProvider: React.FC<PropsWithChildren<AccessProviderProps>> = ({
  policies,
  roles,
  children,
}) => {
  const can = useMemo(() => createCanFn(policies, roles), [policies, roles]);

  const value = useMemo<AccessContextValue>(
    () => ({
      roles,
      can,
    }),
    [roles, can]
  );

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
};

export function useAccess(): AccessContextValue {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error("useAccess must be used within an AccessProvider");
  }
  return ctx;
}
