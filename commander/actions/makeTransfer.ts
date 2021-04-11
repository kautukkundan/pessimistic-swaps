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

    console.log(
      `ERC-20 TRANSFER | from stateID ${from} | to stateID ${to} | amount ${amount}`
    );

    return bytes;
  };

  let txData = [];

  txData.push(await transferEvent(0, 1, 50));
  txData.push(await transferEvent(1, 2, 40));
  txData.push(await transferEvent(2, 3, 50));
  txData.push(await transferEvent(3, 4, 100));
  txData.push(await transferEvent(4, 0, 100));
  txData.push(await transferEvent(4, 1, 20));
  txData.push(await transferEvent(4, 2, 60));
  txData.push(await transferEvent(3, 0, 50));
  txData.push(await transferEvent(2, 1, 30));
  txData.push(await transferEvent(1, 4, 70));

  txData.push(await transferEvent(0, 1, 50));
  txData.push(await transferEvent(1, 2, 40));
  txData.push(await transferEvent(2, 3, 50));
  txData.push(await transferEvent(3, 4, 20));
  txData.push(await transferEvent(4, 0, 5));
  txData.push(await transferEvent(4, 1, 5));
  txData.push(await transferEvent(4, 2, 5));
  txData.push(await transferEvent(3, 0, 20));
  txData.push(await transferEvent(2, 1, 10));
  txData.push(await transferEvent(1, 4, 30));

  return { initialState, txData };
};

export default makeTransfer;
