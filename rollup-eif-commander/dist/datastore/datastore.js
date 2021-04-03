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
const User_1 = __importDefault(require("../entities/User"));
var fs = require("fs");
const path = require("path");
let filename = path.join(__dirname, "datastore.json");
class DataStore {
    constructor() {
        this.userData = [];
        this.length = 0;
    }
    initNew() {
        fs.writeFileSync(filename, JSON.stringify([]), "utf8", () => {
            console.log("saved");
        });
    }
    addMember(user) {
        this.fromJson();
        this.userData.push({ user: user, stateId: this.length });
        this.length += 1;
        this.toJson();
    }
    getMember(address) {
        return this.userData.filter((user) => {
            return user.user.address === address;
        })[0];
    }
    getMemberFromStateId(stateId) {
        return this.userData.filter((user) => {
            return user.stateId === stateId;
        })[0];
    }
    toJson() {
        let flattened = [];
        this.userData.forEach((element) => {
            flattened.push({
                address: element.user.address,
                balance: element.user.balance.toString(),
                nonce: element.user.nonce.toString(),
                stateId: element.stateId,
            });
        });
        let dataJson = JSON.stringify(flattened, null, 4);
        fs.writeFile(filename, dataJson, "utf8", () => {
            console.log("saved");
        });
    }
    fromJson() {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonString = yield fs.readFileSync(filename, "utf8");
            let flattened = JSON.parse(jsonString);
            let unflattened = [];
            flattened.forEach((element) => {
                unflattened.push({
                    user: new User_1.default(element.address, ethers_1.ethers.BigNumber.from(element.balance), ethers_1.ethers.BigNumber.from(element.nonce)),
                    stateId: element.stateId,
                });
            });
            this.userData = unflattened;
            this.length = unflattened.length;
        });
    }
}
exports.default = DataStore;
//# sourceMappingURL=datastore.js.map