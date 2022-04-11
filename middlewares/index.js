const Web3 = require("web3");
const keccak = require("keccak256");
const User = require("../models/user");

const web3 = new Web3("https://rpc-mumbai.maticvigil.com/");

module.exports = {
  verifySignature: async (req, res, next) => {
    try {
      const timeConstant = 3600;

      const time = Math.floor(Math.floor(Date.now() / 1000) / timeConstant);
      const hash = keccak(time.toString()).toString("hex");

      const recoveredAddress = web3.eth.accounts.recover(
        hash,
        req.body.signature
      );

      if (
        req.body.userAddress.toLowerCase() !== recoveredAddress.toLowerCase()
      ) {
        res.send("Invalid signature");
      } else {
        const user = await User.findOne({ address: req.body.userAddress });

        req.user = user;
        next();
      }
    } catch (e) {
      res.send("Invalid signature");
    }
  },
};
