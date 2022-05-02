import { initWeb3, initContract} from '../utils.js'

let Web3;
let WalletManager;
let Accounts;

export default {
    async init() {
        Web3 = await initWeb3();
        WalletManager = await initContract(Web3);
        Accounts =  await Web3.eth.getAccounts().then(result => {
            return result;
        });
    },    
    async deposit(amount) {
        return WalletManager.methods.fund().send({from: Accounts[0], value: amount});
    },
    async getBalance() {
        return WalletManager.methods.balanceOf().call();
    },
    async send(to, amount) {
        return WalletManager.methods.send(to, amount).send({from: Accounts[0]});
    }
  }
  