"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const Rollup_1 = __importDefault(require("./contracts/Rollup"));
const datastore_1 = __importDefault(require("./datastore/datastore"));
const AccountTree_1 = __importDefault(require("./entities/AccountTree"));
const Events_1 = __importDefault(require("./events/Events"));
let web3provider = new ethers_1.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
let database = new datastore_1.default();
database.initNew();
let accountsTree = new AccountTree_1.default();
let events = new Events_1.default(database, accountsTree);
let RollupContractInstance = new ethers_1.ethers.Contract(Rollup_1.default.address, Rollup_1.default.abi, web3provider);
console.log("Initialized Commander");
RollupContractInstance.on("AccountRegistered", (address, balance, nonce) => __awaiter(void 0, void 0, void 0, function* () {
    events.newAccountRegistered(address, balance, nonce);
}));
//# sourceMappingURL=server.js.map