import MerkelTree from "./MerkelTree";

const tree = new MerkelTree();
console.log(tree.root);

tree.insertLeaf(
  "0x0000000000000000000000000000000000000000000000000000000000000001"
);
console.log(tree.root);

tree.insertLeaf(
  "0x0000000000000000000000000000000000000000000000000000000000000001"
);
console.log(tree.root);

tree.updateLeaf(
  "0x0000000000000000000000000000000000000000000000000000000000000001",
  14
);
console.log(tree.root);
