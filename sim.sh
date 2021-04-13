#!/bin/bash 
printf "Starting simulation"

printf "\n\n1. Deploying Rollup Contract via Operator\n"
npx hardhat run scripts/deployRollup.ts --network localhost

printf "\n3. L1 DAI balances before deposit\n"
npx hardhat run scripts/getDAIBalances.ts --network localhost

printf "\n3. L1 ETH balances before deposit\n"
npx hardhat run scripts/getETHBalances.ts --network localhost

printf "\n4. Registering on Layer 2 by depositing DAI\n"
npx hardhat run scripts/depositSimulated.ts --network localhost

printf "\n5. Comparing Layer 1 and Layer 2 Merkle Roots\n"
npx hardhat run scripts/getMerkleRoot.ts --network localhost

printf "\n6. L2 balances before Tx\n"
npx hardhat run scripts/getL2Balances.ts --network localhost

printf "\n7. Performing Swap and sending funds to addresses\n"
npx hardhat run scripts/performSwap.ts --network localhost

printf "\n3. L1 DAI balances after swap\n"
npx hardhat run scripts/getDAIBalances.ts --network localhost

printf "\n3. L1 ETH balances after swap\n"
npx hardhat run scripts/getETHBalances.ts --network localhost