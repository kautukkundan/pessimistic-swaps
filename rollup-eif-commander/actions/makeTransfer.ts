import { ethers } from "ethers";
import Actions from "./Actions";

let makeTransfer = async () => {
  let actions = new Actions();
  await actions.loadDb();
  await actions.loadTree();

  let txData = [];

  let tx = await actions.transferTokens(1, 0, ethers.BigNumber.from("1"));
  let sig = ethers.utils.splitSignature(tx.signature);

  let bytes = ethers.utils.defaultAbiCoder.encode(
    [
      "uint8",
      "bytes32",
      "bytes32",

      "bytes",

      "bytes32[]",
      "bytes32[]",

      "bytes32",
    ],
    [
      sig.v,
      sig.r,
      sig.s,

      tx.toBytes(),

      tx.siblingsFrom,
      tx.siblingsTo,

      tx.accountTree.rootHash,
    ]
  );

  txData.push(bytes);

  console.log(txData);
};

makeTransfer();
