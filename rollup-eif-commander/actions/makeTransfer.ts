import { ethers } from "ethers";
import Actions from "./Actions";

let makeTransfer = async () => {
  let actions = new Actions();
  await actions.loadDb();

  let { txBytes, txMsg, signature } = await actions.transferTokens(
    1,
    0,
    ethers.BigNumber.from("5")
  );
  console.log({ txBytes, txMsg, signature });
};

makeTransfer();
