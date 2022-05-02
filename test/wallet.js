const Wallet = artifacts.require('Wallet');
const truffleAssert = require('truffle-assertions');

contract('Wallet', (accounts) => {
  let wallet = null;
  before(async () => {
    wallet = await Wallet.deployed();
  });

  it('Should set accounts[0] as owner', async () => {
    const owner = await wallet.owner();
    assert(owner === accounts[0]);
  });

  it('Should deposit ether to wallet', async () => {
    await wallet.fund({from: accounts[0], value: 500000});
    const balance = await web3.eth.getBalance(wallet.address);
    assert(parseInt(balance) === 500000);
  });

  it('Should return balance', async () => {
    const balance = await wallet.balanceOf();
    assert(parseInt(balance) === 500000);
  });

  it('Should transfer ether to another address', async () => {
    const balanceRecipientBefore = await web3.eth.getBalance(accounts[1]);
    await wallet.send(accounts[1], 50, {from: accounts[0]});
    const balanceWallet = await web3.eth.getBalance(wallet.address);
    assert(parseInt(balanceWallet) === 499950);
    const balanceRecipientAfter = await web3.eth.getBalance(accounts[1]);
    const finalBalance = web3.utils.toBN(balanceRecipientAfter);
    const initialBalance = web3.utils.toBN(balanceRecipientBefore);
    assert(finalBalance.sub(initialBalance).toNumber() === 50);
  });

  it('Should NOT transfer ether if not owner', async () => {
    await truffleAssert.reverts(wallet.send(accounts[1], 50, {from: accounts[1]}), "Only owner can send money");
  });
});