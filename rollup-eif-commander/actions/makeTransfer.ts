import { ethers } from "ethers";
import Actions from "./Actions";

let makeTransfer = async () => {
  let actions = new Actions();
  await actions.loadDb();
  await actions.loadTree();

  let initialState: string[] = [];
  for (let i = 0; i <= actions.accountTree.nextLeafIndex; i++) {
    let leaf = actions.accountTree.tree[0][i];
    let siblings = actions.accountTree.getSiblings(i);
    let stateId = i;

    let bytes = ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "bytes32[]", "uint256"],
      [leaf, siblings, stateId]
    );
    initialState.push(bytes);
  }

  let transferEvent = async (from: number, to: number, amount: number) => {
    let tx = await actions.transferTokens(
      from,
      to,
      ethers.BigNumber.from(amount)
    );
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

    return bytes;
  };

  let txData = [];

  txData.push(await transferEvent(1, 0, 2));
  //   txData.push(await transferEvent(0, 1, 3));
  //   txData.push(await transferEvent(1, 0, 2));
  //   txData.push(await transferEvent(0, 1, 3));
  //   txData.push(await transferEvent(1, 0, 2));

  console.log(initialState);
  console.log(txData);
};

makeTransfer();
