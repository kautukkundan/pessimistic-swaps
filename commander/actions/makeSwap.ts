import { ethers } from "ethers";
import Actions from "./Actions";

let makeSwap = async () => {
  let actions = new Actions();
  await actions.loadDb();
  await actions.loadTree();

  let initialStates: string[] = [];

  for (let i = 0; i < actions.accountTree.nextLeafIndex; i++) {
    let {
      address: userAddress,
      balance: userBalance,
      nonce: userNonce,
    } = actions.getUserDetails(i);

    let siblings = actions.accountTree.getSiblings(i);
    let stateId = i;

    let bytes = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256", "uint256", "bytes32[]", "uint256"],
      [userAddress, userBalance, userNonce, siblings, stateId]
    );
    initialStates.push(bytes);
  }

  actions.accountTree.resetTree();
  actions.database.resetDB();

  return initialStates;
};

export default makeSwap;
