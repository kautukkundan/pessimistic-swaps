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
const datastore_1 = __importDefault(require("../datastore/datastore"));
const AccountTree_1 = __importDefault(require("../entities/AccountTree"));
const Transaction_1 = __importDefault(require("../entities/Transaction"));
class Actions {
    constructor() { }
    loadDb() {
        return __awaiter(this, void 0, void 0, function* () {
            this.database = new datastore_1.default();
            yield this.database.fromJson();
        });
    }
    loadTree() {
        return __awaiter(this, void 0, void 0, function* () {
            this.accountTree = new AccountTree_1.default(4);
            yield this.accountTree.fromJson();
        });
    }
    transferTokens(from, to, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let tx = new Transaction_1.default(this.database, this.accountTree, from, to, amount);
            yield tx.execute();
            return tx;
        });
    }
}
exports.default = Actions;
//# sourceMappingURL=Actions.js.map