const { PrismaClient } = require("@prisma/client");
const { json } = require("body-parser");
const prisma = new PrismaClient();

exports.cekLogin = async (req, res) => {
  const user = await prisma.users.findMany({
    where: {
      email: req.body.email,
    },
  });

  if (!user[0]) {
    return res.status(201).json({ data: { login: false } });
  }
  var reqjson = json(req);
  console.log(user);

  res.status(201).json({ login: true, email: user[0].email });
};

exports.login = async (req, res) => {};
