export type PageId =
  | "dashboard"
  | "profile"
  | "settings"
  | "users"
  // Sales pages
  | "sales-orders"
  | "sales-customers"
  | "sales-quotations"
  | "sales-invoices"
  | "sales-returns"
  | "sales-reports"
  // Finance pages
  | "finance-ledger"
  | "finance-accounts"
  | "finance-journal"
  | "finance-payables"
  | "finance-receivables"
  | "finance-reports"
  | "finance-budget"
  // Inventory pages
  | "inventory-items"
  | "inventory-warehouses"
  | "inventory-transfers"
  | "inventory-adjustments"
  | "inventory-bom"
  | "inventory-production"
  | "inventory-reports"
  // Banking pages
  | "banking-accounts"
  | "banking-transactions"
  | "banking-transfers"
  | "banking-reports"
  // Warehouse pages
  | "warehouse-inventory"
  | "warehouse-locations"
  | "warehouse-movements"
  | "warehouse-reports";
