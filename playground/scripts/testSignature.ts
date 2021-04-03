import { ethers } from "ethers";

let message =
  "0x943f74a1a43b3242a06de6491b25d303eb52b9ff6ca475c389c5d7a80d47c46e";
let secretKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

let wallet = new ethers.Wallet(secretKey);
console.log(wallet.signMessage(message));
