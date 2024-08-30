const knex = require("knex")(require("../config/knexfile").development);
const User = {
  getAll: (callback) => {
    knex("users")
      .select("*")
      .then((users) => {
        callback(null, users);
      })
      .catch((err) => {
        callback(err, null);
      });
  },

  getById: (id, callback) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) throw err;
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    const query = "INSERT INTO users SET ?";
    db.query(query, data, (err, results) => {
      if (err) throw err;
      callback(null, results.insertId);
    });
  },

  update: (id, data, callback) => {
    const query = "UPDATE users SET ? WHERE id = ?";
    db.query(query, [data, id], (err, results) => {
      if (err) throw err;
      callback(null, results.affectedRows);
    });
  },

  delete: (id, callback) => {
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) throw err;
      callback(null, results.affectedRows);
    });
  },
};

module.exports = User;
