// @ts-ignore
import { ethers } from "hardhat";

async function main() {
  let [owner, ...others] = await ethers.getSigners();

  console.log(await owner.getAddress());

  let signature =
    "0x04671d994ada0b80f980e06d0b6c415a1d3f2e301665c0559033e75fddfc747e22705233c28ab3f76c5b762c7524a5263add512ef99ccdaee66bdd1891e64a271c";
  let message =
    "0x943f74a1a43b3242a06de6491b25d303eb52b9ff6ca475c389c5d7a80d47c46e";

  let sig = ethers.utils.splitSignature(signature);

  let VerifierContract = await ethers.getContractFactory("Verifier");
  let verifier = await VerifierContract.deploy();

  let signer = await verifier.verifyString(message, sig.v, sig.r, sig.s);
  console.log(signer);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
