const keccak = require('keccak256');
const Web3 = require('web3');

module.exports = {
  createSignature: data => {
    const web3 = new Web3(
      'https://rinkeby.infura.io/v3/7c4e9e4322bc446195e561d9ea27d827',
    );

    const hash = keccak(data).toString('hex');
    const signedObject = web3.eth.accounts.sign(hash, process.env.PRIVATE_KEY);

    return { hash, signedObject };
  },
};
