# react-access-policy

Tiny, declarative **role & permission (RBAC)** helper for React apps.  
Built to keep authorization logic **out of JSX**, **easy to reason about**, and **enterprise-ready**.

> Simple for users. Powerful under the hood.

---

## Why react-access-policy?

Most apps end up with messy permission checks like:

```tsx
{user?.roles?.includes("ADMIN") && user?.permissions?.includes("EDIT_USER") && (
  <Button>Edit</Button>
)}
````

This package lets you write **clean, declarative access rules** instead.

---

## Install

```bash
npm install react-access-policy
# or
yarn add react-access-policy
# or
pnpm add react-access-policy
```

---

## Core Concepts

* **Roles** → `admin`, `manager`, `viewer`
* **Permissions** → `user.view`, `user.edit`, `user.delete`
* **Policies** → map roles to permissions
* **AccessProvider** → supplies access rules to your app
* **Can / useCan** → check permissions anywhere

---

## 1. Define Access Policies

Create a single source of truth for all permissions.

```ts
// access-policies.ts
import { definePolicies } from "react-access-policy";

export const policies = definePolicies({
  admin: {
    can: "*", // full access
  },
  manager: {
    can: ["user.view", "user.edit"],
    inherits: ["viewer"],
  },
  viewer: {
    can: ["user.view"],
  },
});
```

### Features supported

* ✅ Role inheritance
* ✅ Wildcard permissions (`*`)
* ✅ Unlimited roles & permissions
* ✅ Circular inheritance safe

---

## 2. Wrap Your Application

Provide user roles and policies once at the root.

```tsx
// App.tsx / _app.tsx / layout.tsx
import { AccessProvider } from "react-access-policy";
import { policies } from "./access-policies";

export default function App({ children }: { children: React.ReactNode }) {
  const user = {
    roles: ["manager"], // from API / JWT / Keycloak
  };

  return (
    <AccessProvider policies={policies} roles={user.roles}>
      {children}
    </AccessProvider>
  );
}
```

---

## 3. Use `<Can />` Component (Recommended)

Declarative, readable, and clean.

```tsx
import { Can } from "react-access-policy";

function UserActions() {
  return (
    <>
      <Can I="user.view">
        <p>User details are visible</p>
      </Can>

      <Can I="user.edit">
        <button>Edit User</button>
      </Can>

      <Can I="user.delete" fallback={null}>
        <button style={{ color: "red" }}>Delete User</button>
      </Can>
    </>
  );
}
```

---

## 4. Use `useCan()` Hook

Perfect for conditional logic.

```tsx
import { useCan } from "react-access-policy";

function Toolbar() {
  const canEdit = useCan("user.edit");
  const canViewOrEdit = useCan(["user.view", "user.edit"], "any");

  return (
    <>
      {canViewOrEdit && <button>View</button>}
      {canEdit && <button>Edit</button>}
    </>
  );
}
```

---

## 5. Check Multiple Permissions

### Require **ALL** permissions (default)

```tsx
<Can I={["user.view", "user.edit"]}>
  <button>View & Edit</button>
</Can>
```

### Require **ANY** permission

```tsx
<Can I={["user.edit", "user.delete"]} mode="any">
  <button>Edit or Delete</button>
</Can>
```

---

## 6. Render-Prop Pattern (Advanced)

When you need full control:

```tsx
<Can I="user.edit">
  {(allowed) =>
    allowed ? <button>Edit</button> : <span>Read only</span>
  }
</Can>
```

---

## API Reference

### `<AccessProvider />`

```ts
<AccessProvider
  policies={PolicyConfig}
  roles={string[]}
>
  {children}
</AccessProvider>
```

---

### `<Can />`

| Prop       | Type                                  | Description                 |
| ---------- | ------------------------------------- | --------------------------- |
| `I`        | `string \| string[]`                  | Permission(s) to check      |
| `mode`     | `"all" \| "any"`                      | Permission check mode       |
| `fallback` | `ReactNode`                           | Rendered when access denied |
| `children` | `ReactNode \| (allowed) => ReactNode` | Content                     |

---

### `useCan(permission, mode?)`

```ts
const allowed = useCan("user.edit");
```

---

## Works Great With

* ✅ Keycloak
* ✅ Auth0
* ✅ JWT-based auth
* ✅ Django / Node / Laravel backends
* ✅ Enterprise dashboards

---

## Design Philosophy

* **UI should not know about roles**
* **Permissions are declarative**
* **No magic strings scattered across components**
* **One config → entire app protected**

---

## Roadmap

* [ ] Attribute-based access (ABAC)
* [ ] Resource-level permissions
* [ ] Dev warnings for missing policies
* [ ] DevTools inspector
* [ ] SSR helpers

---

## License

MIT © Er Raj Aryan

```

---

### Next power moves 🚀
If you want, I can help you:
- add **badges** (npm, downloads, types)
- create a **live demo repo**
- optimize README for **npm search ranking**
- write a **launch post** for LinkedIn / X

Just say the word.
```
