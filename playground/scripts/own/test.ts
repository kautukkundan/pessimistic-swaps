import MerkelTree from "./MerkelTree";

const tree = new MerkelTree();
console.log(tree.rootHash);

tree.insertLeaf(
  "0x0000000000000000000000000000000000000000000000000000000000000001"
);
console.log(tree.rootHash);
tree.insertLeaf(
  "0x0000000000000000000000000000000000000000000000000000000000000001"
);
console.log(tree.rootHash);
