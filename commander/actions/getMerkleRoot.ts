import Actions from "./Actions";

let getRootHash = async () => {
  let actions = new Actions();
  await actions.loadDb();
  await actions.loadTree();

  return actions.getMerkleRoot();
};

export default getRootHash;
