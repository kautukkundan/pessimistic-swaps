#!/bin/bash 
printf "Starting simulation"

printf "\n\n===========================================================================\n"
printf "Layer 1 Operations"
printf "\n===========================================================================\n"

printf "\n\n1. Deploying Rollup Contract via Operator\n"
npx hardhat run scripts/deployRollup.ts --network localhost

printf "\n2. Sending ERC-20 tokens to addresses for usage\n"
npx hardhat run scripts/distributeERC20.ts --network localhost

printf "\n3. L1 ERC-20 balances before deposit\n"
npx hardhat run scripts/getBalances.ts --network localhost

printf "\n4. Registering on Layer 2 by depositing ERC-20\n"
npx hardhat run scripts/makeDeposit.ts --network localhost

printf "\n5. Comparing Layer 1 and Layer 2 Merkle Roots\n"
npx hardhat run scripts/getMerkleRoot.ts --network localhost

printf "\n\n===========================================================================\n"
printf "Layer 2 Operations"
printf "\n===========================================================================\n"

printf "\n6. L2 balances before Tx\n"
npx hardhat run scripts/getL2Balances.ts --network localhost

printf "\n7. performing transactions\n"
npx hardhat run scripts/updateStates.ts --network localhost

printf "\n8. L2 balances after Tx\n"
npx hardhat run scripts/getL2Balances.ts --network localhost

printf "\n\n===========================================================================\n"
printf "Layer 1 Operations"
printf "\n===========================================================================\n"

printf "\n9. Withdrawing Balances on L1 \n"
npx hardhat run scripts/withdraw.ts --network localhost

printf "\n10. L1 ERC-20 balances after withdraw\n"
npx hardhat run scripts/getBalances.ts --network localhost