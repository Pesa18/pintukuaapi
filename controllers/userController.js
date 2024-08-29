const knex = require("knex")(require("../config/knexfile").development);

// Menggunakan Knex untuk menjalankan query

exports.getAllUsers = (req, res) => {
  knex("users")
    .select("*")
    .then((users) => {
      console.log(users);
    })
    .catch((err) => {
      console.error(err);
    });
};
