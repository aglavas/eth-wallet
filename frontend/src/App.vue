<template>
  <div id="app">
    <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h1>Ether Wallet</h1>
          <h2>Deposit</h2>
          <div class="form-group">
            <label for="deposit-amount">Value</label>
            <input v-model="fund.amount" id="deposit-amount" type="number" class="form-control">
          </div>
          <ValidationErrors :errors="errors.fund"></ValidationErrors>
          <button @click="fundWallet" class="btn btn-primary">Submit</button>
          <p> {{ fund.result }} </p>
          <hr>
          <h2>Send</h2>
          <div class="form-group">
            <label for="send-to">To</label>
            <input v-model="send.address" id="send-to" type="text" class="form-control">
          </div>
          <div class="form-group">
            <label for="send-amount">Amount</label>
            <input v-model="send.amount" id="send-amount" type="number" class="form-control">
          </div>
          <ValidationErrors :errors="errors.send"></ValidationErrors>
          <button @click="sendTo" class="btn btn-primary">Submit</button>
          <div>
            <p>{{ send.result }}</p>
            <hr>
            <h2>Balance</h2>
            <p id="balance"> {{ balance}} </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WalletManager from './models/walletManager.js'
import ValidationErrors from './components/ValidationErrors.vue'

export default {
  name: 'App',
  components: {
    ValidationErrors
  },
  data() {
    return {
      walletManager: null,
      balance: null,
      errors: {
        fund: [],
        send: [],
      },
      fund: {
        amount: null,
        result: null,
      },
      send: {
        address: null,
        amount: null,
        result: null
      }
    }
  },
  beforeCreate() {
    this.walletManager = WalletManager;
  },
  async mounted() {
    await WalletManager.init();
    this.walletManager = WalletManager;
    await this.getBalance();
  },
  methods: {
    async getBalance() {
      const balance = await this.walletManager.getBalance();

      if (balance) {
        this.balance = balance + " WEI";
      } else {
        this.balance = "N/A";
      }
    },
    async fundWallet() {
      this.errors.fund = [];
      this.fund.result = null;

      if (!this.fund.amount || (this.fund.amount <= 0)) {
        this.errors.fund.push("Fund amount is missing");
        return true;
      }

      const resultPromise = this.walletManager.deposit(this.fund.amount);
      resultPromise.then(() => {
        this.fund.result = `Wallet has been funded with ${this.fund.amount} WEI`;
        this.getBalance();
      }).catch(() => {
        this.fund.result = `Error while trying to fund the wallet.`; 
      });
    },
    async sendTo() {
      this.errors.send = [];
      this.send.result = null;

      if (!this.send.amount || (this.send.amount <= 0)) {
        this.errors.send.push("Send amount is missing");
      }

      if (!this.send.address) {
        this.errors.send.push("Send address is missing");
      }

      if (this.errors.send.length) {
        return true;
      }

      const resultPromise = this.walletManager.send(this.send.address, this.send.amount);
      resultPromise.then(() => {
        this.send.result = `${this.send.amount} WEI has been sent to ${this.send.address}`;
        this.getBalance();
      }).catch(() => {
        this.send.result = `Error while trying to send the funds.`; 
      });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
