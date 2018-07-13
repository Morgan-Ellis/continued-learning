const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "polish_debonair_meaty_gold_preserve_befitting_glorious_uncle_trail");
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    }
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authorization failed. ʕ•́ᴥ•̀ʔ"
    })
  }
};
