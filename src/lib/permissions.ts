import type { Role } from "@/types/auth";

// Centralized permission registry (ERP.md §3 — Dynamic RBAC).
// Permissions follow `<module>.<resource>.<action>` or shorthand
// `<module>.<action>`. The wildcard `<module>.*` grants all actions in a module.
//
// Adding a new module: list its base permissions here AND extend
// ROLE_PERMISSIONS for each role that should have access by default.

export const PERMISSION_MODULES = [
  "dashboard",
  "sales",
  "finance",
  "inventory",
  "banking",
  "warehouse",
  "users",
  "settings",
  "reports",
  "telegram",
] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  super_admin: [
    "dashboard.view",
    "sales.*", "finance.*", "inventory.*",
    "banking.*", "warehouse.*",
    "users.view", "users.create", "users.edit", "users.delete",
    "settings.view", "settings.edit",
    "reports.view", "reports.export",
    "telegram.view", "telegram.edit",
  ],
  admin: [
    "dashboard.view",
    "sales.*", "finance.*", "inventory.*",
    "banking.*", "warehouse.*",
    "users.view", "users.create", "users.edit",
    "settings.view", "settings.edit",
    "reports.view", "reports.export",
    "telegram.view", "telegram.edit",
  ],
  accountant: [
    "dashboard.view",
    "finance.view", "finance.create", "finance.edit",
    "sales.invoices.view",
    "banking.view", "banking.accounts.view",
    "banking.transactions.view", "banking.transactions.create",
    "banking.transfers.view", "banking.transfers.create",
    "banking.reports.view",
    "reports.view", "reports.export",
    "settings.view",
  ],
  salesman: [
    "dashboard.view",
    "sales.view", "sales.create", "sales.edit",
    "sales.customers.view", "sales.customers.create",
    "inventory.items.view",
    "warehouse.view", "warehouse.inventory.view",
    "reports.view",
    "settings.view",
  ],
  store_keeper: [
    "dashboard.view",
    "inventory.view", "inventory.create", "inventory.edit",
    "inventory.transfers.view", "inventory.transfers.create",
    "inventory.adjustments.view", "inventory.adjustments.create",
    "warehouse.view", "warehouse.inventory.view",
    "warehouse.locations.view",
    "warehouse.movements.view", "warehouse.movements.create",
    "warehouse.reports.view",
    "reports.view",
    "settings.view",
  ],
};

function matchPermission(userPerm: string, requiredPerm: string): boolean {
  if (userPerm === requiredPerm) return true;
  if (userPerm.endsWith(".*")) {
    const prefix = userPerm.slice(0, -1);
    if (requiredPerm.startsWith(prefix)) return true;
  }
  return false;
}

export function checkPermission(permissions: string[], required: string): boolean {
  return permissions.some((p) => matchPermission(p, required));
}

export function checkAnyPermission(
  permissions: string[],
  required: string[]
): boolean {
  return required.some((r) => checkPermission(permissions, r));
}

export function checkAllPermissions(
  permissions: string[],
  required: string[]
): boolean {
  return required.every((r) => checkPermission(permissions, r));
}
