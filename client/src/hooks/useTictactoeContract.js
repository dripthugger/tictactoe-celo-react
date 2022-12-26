import { useContract } from "./useContract";
import TICTACTOENFT from "../contracts/TICTACTOENFT.json";
import TICTACTOENFTAddress from "../contracts/TICTACTOENFTAddress.json";

// export interface for smart contract
export const useTictactoeContract = () =>
  useContract(TICTACTOENFT.abi, TICTACTOENFTAddress.TICTACTOENFT);
