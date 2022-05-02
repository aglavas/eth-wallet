import Web3 from 'web3';
import WalletManager from '../../build/contracts/Wallet.json';

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:7545'));
  });
};

const initContract = async (web3) => {
  const networkId = await web3.eth.net.getId();

  return new web3.eth.Contract(
    WalletManager.abi, 
    WalletManager
      .networks[networkId]
      .address
  );
};

export { initWeb3, initContract};