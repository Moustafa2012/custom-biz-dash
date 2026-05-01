import { create } from "zustand";
import type {
  WarehouseInventoryItem,
  WarehouseLocation,
  WarehouseMovement,
} from "../types";

// Empty by design — backend hydration will follow.

interface WarehouseState {
  inventory: WarehouseInventoryItem[];
  locations: WarehouseLocation[];
  movements: WarehouseMovement[];

  setInventory: (i: WarehouseInventoryItem[]) => void;
  setLocations: (l: WarehouseLocation[]) => void;
  setMovements: (m: WarehouseMovement[]) => void;
}

export const useWarehouseStore = create<WarehouseState>((set) => ({
  inventory: [],
  locations: [],
  movements: [],
  setInventory: (inventory) => set({ inventory }),
  setLocations: (locations) => set({ locations }),
  setMovements: (movements) => set({ movements }),
}));
