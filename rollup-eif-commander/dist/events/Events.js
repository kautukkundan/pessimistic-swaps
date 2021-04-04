"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../entities/User"));
class Events {
    constructor(database, accountsTree) {
        this.newAccountRegistered = (address, balance, nonce) => {
            let newUser = new User_1.default(address, balance, nonce);
            let siblings = this.accountsTree.getSiblings(this.accountsTree.nextLeafIndex);
            this.accountsTree.insertLeaf(siblings, newUser.toBytes());
            this.database.addMember(newUser);
            let siblingsNext = this.accountsTree.getSiblings(this.accountsTree.nextLeafIndex);
            console.log({ siblingsNext });
        };
        this.database = database;
        this.accountsTree = accountsTree;
    }
}
exports.default = Events;
//# sourceMappingURL=Events.js.map