const keccak = require('keccak256');

module.exports = {
  createSignature: data => {
    const hash = keccak(data).toString('hex');
    const signedObject = web3.eth.accounts.sign(hash, process.env.PRIVATE_KEY);

    return { hash, signedObject };
  },
};
