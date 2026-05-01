# Features

Feature-based modules per ERP.md §1.2 / §2.1.

Each feature folder owns its components, hooks, services, stores, and types.
Public surface is exposed through the feature's `index.ts` barrel.

```
features/
├── banking/      # Banking module (accounts, transactions, transfers, reports)
├── warehouse/    # Warehouse module (inventory, locations, movements, reports)
└── notifications/
```

Existing Sales / Finance / Inventory modules continue to live under
`src/components/erp/` for backwards compatibility and will be migrated
incrementally.
