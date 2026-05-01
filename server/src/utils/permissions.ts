type Role = 'super_admin' | 'admin' | 'accountant' | 'salesman' | 'store_keeper';

export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 100,
  admin: 80,
  accountant: 60,
  salesman: 40,
  store_keeper: 20,
};

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  super_admin: [
    'dashboard.view',
    'sales.*', 'finance.*', 'inventory.*',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'settings.view', 'settings.edit',
    'reports.view', 'reports.export',
  ],
  admin: [
    'dashboard.view',
    'sales.*', 'finance.*', 'inventory.*',
    'users.view', 'users.create', 'users.edit',
    'settings.view', 'settings.edit',
    'reports.view', 'reports.export',
  ],
  accountant: [
    'dashboard.view',
    'finance.view', 'finance.create', 'finance.edit',
    'sales.invoices.view',
    'reports.view', 'reports.export',
    'settings.view',
  ],
  salesman: [
    'dashboard.view',
    'sales.view', 'sales.create', 'sales.edit',
    'sales.customers.view', 'sales.customers.create',
    'inventory.items.view',
    'reports.view',
    'settings.view',
  ],
  store_keeper: [
    'dashboard.view',
    'inventory.view', 'inventory.create', 'inventory.edit',
    'inventory.transfers.view', 'inventory.transfers.create',
    'inventory.adjustments.view', 'inventory.adjustments.create',
    'reports.view',
    'settings.view',
  ],
};

export const canAccess = (currentUserRole: Role, targetRole: Role): boolean => {
  return ROLE_HIERARCHY[currentUserRole] > ROLE_HIERARCHY[targetRole];
};

export const checkPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.some((userPerm) => matchPermission(userPerm, requiredPermission));
};

function matchPermission(userPerm: string, requiredPerm: string): boolean {
  if (userPerm === requiredPerm) return true;
  if (userPerm.endsWith('.*')) {
    const prefix = userPerm.slice(0, -1);
    if (requiredPerm.startsWith(prefix)) return true;
  }
  return false;
}
