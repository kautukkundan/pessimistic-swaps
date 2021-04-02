import { ethers } from "ethers";
import Actions from "./Actions";

let makeTransfer = async () => {
  let actions = new Actions();
  await actions.loadDb();

  actions.transferTokens(1, 0, ethers.BigNumber.from("5"));
};

makeTransfer();
