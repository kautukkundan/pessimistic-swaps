import { ethers } from "ethers";
import Actions from "./Actions";

let makeTransfer = async () => {
  let actions = new Actions();
  await actions.loadDb();
  await actions.loadTree();

  let tx = await actions.transferTokens(0, 1, ethers.BigNumber.from("5"));
  console.log({
    signature: tx.signature,
    message: tx.toMessage(),
    bytes: tx.toBytes(),
  });
};

makeTransfer();
