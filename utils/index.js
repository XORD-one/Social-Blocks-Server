const keccak = require('keccak256');
const { privateKey } = require('../config.json');

module.exports = {
  createSignature: data => {
    const hash = keccak(data).toString('hex');
    const signedObject = web3.eth.accounts.sign(hash, privateKey);

    return { hash, signedObject };
  },
};
