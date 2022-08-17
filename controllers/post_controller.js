const User = require("../models/user");
const axios = require("axios");

const getTransferHistory = async (req, res) => {
  let id = req.params.id;

  const result = await axios.post(
    "https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks-subgraph",
    {
      query: `
      {
        posts(where:{id:"${id}"}){
          transferHistory
        }
      }
    `,
    }
  );

  let transferArr = result?.data?.data?.posts[0]?.transferHistory;

  if (transferArr) {
    let users = await User.find({
      address: {
        $in: transferArr,
      },
    });
    let usersInOrder = [];

    if (users) {
      users.forEach((user) => {
        usersInOrder[transferArr.indexOf(user.address.toLowerCase())] = user;
      });
    }

    res.json({
      usersInOrder,
    });
  } else {
    res.json({ message: "post not found." });
  }
};

module.exports = {
  getTransferHistory,
};
