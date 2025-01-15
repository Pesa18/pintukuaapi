const validateUUID = (req, res, next) => {
  const { uuid } = req.params;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    return res.status(400).json({ message: "Invalid UUID format." });
  }
  next();
};
module.exports = validateUUID;
