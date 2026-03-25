export interface User {
  id: string;
  email: string;
  api_key: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string | null;
  prefix: string;
  hash: string;
  revoked_at: string | Date | null;
  expires_at: string | Date | null;
  last_used_at: string | Date | null;
  created_at?: string | Date;
}

export type Variables = {
  userId: string;
  rawApiKey: string;
}

export type AccountType = "savings" | "checking" | "investment"

export type AccountStatus = "active" | "frozen" | "closed"

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "JPY";

export interface Account {
  id: string;
  user_id: string;
  account_name: string;
  account_type: AccountType;
  account_status: AccountStatus;
  currency: CurrencyCode;
}

export type AccountWithBalance = Account & {
  balance: number
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export type TransactionType = "credit" | "debit"

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  amount: number;
  type: TransactionType

}
