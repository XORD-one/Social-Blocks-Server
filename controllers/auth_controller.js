const User = require("../models/user");

const register = async (req, res) => {
  let checkUser = await User.findOne({ username: req.body.username });
  if (checkUser) {
    res.json({ error: "Username is taken" });
  } else {
    let user = new User({
      displayName: req.body.displayName,
      username: req.body.username,
      img: req.body.img,
      address: req.body.address,
    });
  }
};

module.exports = {
  register: register,
};
