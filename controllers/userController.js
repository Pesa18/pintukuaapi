const user = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  await user.getAll((err, users) => {
    try {
      if (err) res.status(500).send(err);
      res.json(users);
      console.log(users);
    } catch (err) {
      console.error(err.message);
    }
  });
};
