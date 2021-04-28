- [📜 Pessimistic Swaps](#-pessimistic-swaps)
  - [📝 Introduction](#-introduction)
    - [Inspiration](#inspiration)
    - [Pessimistic Rollup](#pessimistic-rollup)
    - [The Swap](#the-swap)
    - [Architecture and Security](#architecture-and-security)
    - [Demo](#demo)
  - [🏃‍♂️ How to run](#️-how-to-run)
  - [⛽️ Gas Comparisons](#️-gas-comparisons)
    - [Cost Naive](#cost-naive)
    - [Cost Pessimism](#cost-pessimism)
    - [Total Gas Consumed in Simulation](#total-gas-consumed-in-simulation)

# 📜 Pessimistic Swaps

Uniswap token swap via Layer 2 pessimistic rollup

## 📝 Introduction

Uniswap token swaps are expensive and takes around ~150K gas per transaction. This project aims to solve this issue by batching users who wish to perform same token swaps. Instead of each user doing individual swap, a bunch of users are grouped together, their tokens are added together, the total sum of tokens are swapped in a single transaction and finally the swapped token is distributed to the users based on their initial share.

This is acheived by using a layer 2 "pessimistic" rollup which acts as a "super wallet" for the users. The rollup keeps track of the individual deposits and performs swap when a sufficient number of users are available. By doing batched transaction with batch size N, the total gas required from swap is reduced from N\*x to just x.

### Inspiration

[Pessimistic rollup: Scalable batched smart contract interactions](https://ethresear.ch/t/pessimistic-rollup-scalable-batched-smart-contract-interactions/7765)

### Pessimistic Rollup

The rollup is "pessimistic", it means that all the transactions are saved and applied on-chain. When the user makes a deposit on the Rollup contract, the user details are encoded and converted into a "leaf" for a merkle tree, this leaf is then inserted on-chain and the root hash is saved. At the same time the leaf is also created and inserted on layer-2 server.
If it was an "optimistic" rollup, then the leaf would have only been inserted on layer-2 and only the resultant root hash would have been saved on-chain. However to make it secure a "challenge function" would be required and a specific time frame would have to be set until when the challenge period remained open.
Pessimistic rollups provide some benefits in terms of time period but it comes at the price of some gas.

### The Swap

Once a set number of users make deposits, a batch is created. The total sum of all the users is swapped entirely, this does cause some price slippage on uniswap but here we are not concerned about that complexity for the time being. After the swap the resulting token is then distributed to the users based on their shares.
How it works:

1. Since the user details are stored on-chain as encoded leaves, the user address and balance stored on Layer-2 is taken and encoded to form a leaf.
2. The siblings (aka merkle proofs) of the said leaf is also taken
3. This is done for all the users
4. The leaf as well as the siblings are sent on-chain
5. Verification is done to ensure that the user state is actually included in the current merkle root hash.
6. If the verification passes, the funds are swapped and sent to users on-chain

### Architecture and Security

The project only focusses on a single token pair, that is, all users deposit DAI and get ETH. Moreover entire 100% of the deposited tokens are converted. Due to these reason, signing of transaction is not required as all the tokens will be converted and the deposit of the token by user is considered as a consent.
Had there been an option for multi pair swap and partial amount, then the user would have been required to sign the transaction for X token and N% of total amoount.

### Demo

[YouTube](https://www.youtube.com/watch?v=KGp5uvnfkTk)

## 🏃‍♂️ How to run

1. Clone the repo and `cd` into the folder.
2. Install dependencies by running `npm install`.
3. Get an API key from alchemy or infura and change the forking url inside `hardhat.config.ts`.
4. let the block number be same.
5. Open 3 terminal windows and run these commands in order.
   1. `npx hardhat node` in first terminal to start an instance of hardhat.
   2. `npm start` in second terminal to start an instance of layer 2 server (commander).
   3. `./run.sh` in third terminal to run scripts one by one in automated fashion to simulate the user transactions.
6. The commands should execute and the run script should finish execution.

## ⛽️ Gas Comparisons

### Cost Naive

| Description | Gas Used     | Number Required |
| ----------- | ------------ | --------------- |
| uniswap     | 150,300 gwei | n               |

### Cost Pessimism

| Description  | Gas Used    | Number Required |
| ------------ | ----------- | --------------- |
| merkle proof |             | n               |
| root storage |             | n               |
| Total        | 76,000 gwei | n               |

Which is an 150300 / 76000 = ~2x improvement

### Total Gas Consumed in Simulation

Total gas = (Gas spent by User + Gas spent by operator Operator)
Gas consumed by operator basically means the gas spent by the operator to execute the swap function after all the users have deposited their balances.

The application runs on a hardhat node with mainnet forking and impersonates 10 accounts with varying DAI balances and varying swap amounts.

| Type           | Gas Used (only swap) |
| -------------- | -------------------- |
| Native L1 Swap | 1,503,682 gwei       |
| Rollup Swap    | 595,786 gwei         |

We can clearly see the huge difference between native Layer 1 and Layer 2 swap. There is almost 2.5x improvement on the total gas consumed.

| Type           | Gas Used (deposit + swap) |
| -------------- | ------------------------- |
| Native L1 Swap | 1,503,682 gwei            |
| Rollup Swap    | 1,409,474 gwei            |

If we try to include the cost for deposit, which is actually just a one time upfront cost. The user can make a deposit 1 time and then opt to do any number of swaps with any arbitrary amount at a constant price (currently the functionality is not implemented). We can still see that there is atleast a 10% improvement in gas price as compared to native Layer 1 swap and this percentage will definitely increase as the size of batch increases. Also note that the code is not very optimized for gas.
