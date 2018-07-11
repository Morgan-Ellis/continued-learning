const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "polish_debonair_meaty_gold_preserve_befitting_glorious_uncle_trail");
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authorization failed. ʕ•́ᴥ•̀ʔ"
    })
  }
};
