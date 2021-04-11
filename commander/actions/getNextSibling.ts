import Actions from "./Actions";

let getNextSibling = async () => {
  let actions = new Actions();
  await actions.loadDb();
  await actions.loadTree();

  return actions.getNextSibling();
};

export default getNextSibling;
