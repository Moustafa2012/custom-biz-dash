/**
 * Virtual clearing accounts.
 *
 * Real customer accounts have ids in the `acc-...` namespace. Clearing
 * accounts are bank-internal control accounts used by the engine to keep
 * every posting balanced (debits == credits per currency) while a transfer
 * is in flight or being reconciled.
 *
 * They are NOT shown in the Accounts list, but they ARE included in
 * reports and the audit ledger so reconciliation is provable.
 */

export const CLEARING_PREFIX = 'clr:'

/** Funds debited from source while awaiting bank confirmation. */
export const transfersInFlight = (currency: string) =>
  `${CLEARING_PREFIX}transfers_in_flight:${currency.toUpperCase()}`

/** External counterparty for settled outbound transfers. */
export const externalCounterparty = (currency: string) =>
  `${CLEARING_PREFIX}external:${currency.toUpperCase()}`

/** Bank fee P&L account. */
export const feesAccount = (currency: string) =>
  `${CLEARING_PREFIX}fees:${currency.toUpperCase()}`

/** FX gain/loss bucket. */
export const fxAccount = (currency: string) =>
  `${CLEARING_PREFIX}fx:${currency.toUpperCase()}`

export const isClearing = (accountId: string) => accountId.startsWith(CLEARING_PREFIX)
