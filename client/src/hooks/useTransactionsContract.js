import { useContract } from "./useContract";
import Transactions from "../contracts/Transactions.json";
import TransactionsAddress from "../contracts/TransactionsAddress.json";

// export interface for smart contract
export const useTransactionsContract = () =>
  useContract(Transactions.abi, TransactionsAddress.Transactions);
