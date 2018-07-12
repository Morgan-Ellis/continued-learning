const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

//POST SIGN UP
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created. ʕっ•ᴥ•ʔっ *:･ﾟ✧",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

//POST LOGIN
router.post("/login", (req, res, next) => {
  let fetchedUser;

  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authorization failed- email not found. ʕ╭ರᴥ•́ʔ"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Authorization failed- incorrect password. ʕ╭ರᴥ•́ʔ"
        });
      }
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, "polish_debonair_meaty_gold_preserve_befitting_glorious_uncle_trail", {
        expiresIn: "1h"
      });
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        message: "Logged in successfully. ᕙʕಠᴥಠʔᕗ"
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: "Authorization failed.  ʕ•́ᴥ•̀ʔ"
      });
    });
});

module.exports = router;
