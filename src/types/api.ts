export type Currency = {
  id: string;
  code: string;
  symbol: string;
};

export type Balance = {
  id: string;
  currency_id: number;
  amount: string;
};
