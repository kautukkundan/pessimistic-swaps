import { ethers } from "ethers";
import Actions from "./Actions";

let makeTransfer = async () => {
  let actions = new Actions();
  await actions.loadDb();
  await actions.loadTree();

  let tx = await actions.transferTokens(0, 1, ethers.BigNumber.from("2"));
  console.log({
    signature: tx.signature,
    message: tx.toMessage(),
    bytes: tx.toBytes(),
    userFrom: {
      userFrom: tx.getUserFrom(),
      stateId: tx.from,
      siblings: tx.siblingsFrom,
    },
    userTo: {
      userTo: tx.getUserTo(),
      stateId: tx.to,
      siblings: tx.siblingsTo,
    },
  });

  let tx2 = await actions.transferTokens(0, 1, ethers.BigNumber.from("5"));
  console.log({
    signature: tx2.signature,
    message: tx2.toMessage(),
    bytes: tx2.toBytes(),
    userFrom: {
      userFrom: tx2.getUserFrom(),
      stateId: tx2.from,
      siblings: tx2.siblingsFrom,
    },
    userTo: {
      userTo: tx2.getUserTo(),
      stateId: tx2.to,
      siblings: tx2.siblingsTo,
    },
  });

  let tx3 = await actions.transferTokens(2, 0, ethers.BigNumber.from("7"));
  console.log({
    signature: tx3.signature,
    message: tx3.toMessage(),
    bytes: tx3.toBytes(),
    userFrom: {
      userFrom: tx3.getUserFrom(),
      stateId: tx3.from,
      siblings: tx3.siblingsFrom,
    },
    userTo: {
      userTo: tx3.getUserTo(),
      stateId: tx3.to,
      siblings: tx3.siblingsTo,
    },
  });

  let tx4 = await actions.transferTokens(0, 3, ethers.BigNumber.from("6"));
  console.log({
    signature: tx4.signature,
    message: tx4.toMessage(),
    bytes: tx4.toBytes(),
    userFrom: {
      userFrom: tx4.getUserFrom(),
      stateId: tx4.from,
      siblings: tx4.siblingsFrom,
    },
    userTo: {
      userTo: tx4.getUserTo(),
      stateId: tx4.to,
      siblings: tx4.siblingsTo,
    },
  });
};

makeTransfer();
