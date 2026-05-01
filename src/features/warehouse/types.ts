// Warehouse domain types (frontend-only stubs).
// See ERP.md §5 (Warehouse Module Specification).

export type LocationType = "warehouse" | "zone" | "rack" | "bin";
export type MovementType = "receipt" | "issue" | "transfer" | "adjustment";
export type MovementStatus = "draft" | "posted" | "cancelled";

export interface WarehouseLocation {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  parentId?: string | null;
}

export interface WarehouseInventoryItem {
  id: string;
  sku: string;
  name: string;
  uom: string;
  locationId: string;
  quantity: number;
  reorderPoint?: number;
}

export interface WarehouseMovement {
  id: string;
  type: MovementType;
  status: MovementStatus;
  date: string;
  itemId: string;
  fromLocationId?: string;
  toLocationId?: string;
  quantity: number;
  reference?: string;
}

export type WarehousePageId =
  | "warehouse-dashboard"
  | "warehouse-inventory"
  | "warehouse-locations"
  | "warehouse-movements"
  | "warehouse-reports";
