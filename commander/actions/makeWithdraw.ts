import { ethers } from "ethers";
import Actions from "./Actions";

let makeWithdraw = async () => {
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

  let withdrawEvent = async (from: number, amount: number) => {
    let tx = await actions.withdrawTokens(from, ethers.BigNumber.from(amount));
    let sig = ethers.utils.splitSignature(tx.signature);

    let bytes = ethers.utils.defaultAbiCoder.encode(
      ["uint8", "bytes32", "bytes32", "bytes", "bytes32[]", "bytes32"],
      [
        sig.v,
        sig.r,
        sig.s,

        tx.toBytes(),

        tx.siblingsFrom,

        tx.accountTree.rootHash,
      ]
    );

    return bytes;
  };

  let txData = [];

  txData.push(await withdrawEvent(0, 150));
  txData.push(await withdrawEvent(1, 330));
  txData.push(await withdrawEvent(2, 210));
  txData.push(await withdrawEvent(3, 50));
  txData.push(await withdrawEvent(4, 110));

  return { initialState, txData };
};

export default makeWithdraw;
