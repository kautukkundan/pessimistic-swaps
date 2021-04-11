import Actions from "./Actions";

let getBalances = async () => {
  let actions = new Actions();
  await actions.loadDb();
  await actions.loadTree();

  let n_users = actions.accountTree.nextLeafIndex;

  for (let i = 0; i < n_users; i++) {
    let details = actions.getBalanceOfUser(i);
    console.log(`address : ${details.address} | balance ${details.balance}`);
  }
};

export default getBalances;
