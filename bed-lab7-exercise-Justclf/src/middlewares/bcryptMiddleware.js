//////////////////////////////////////////////////////
// REQUIRE BCRYPT MODULE
//////////////////////////////////////////////////////
const bcrypt = require("bcrypt");

//////////////////////////////////////////////////////
// SET SALT ROUNDS
//////////////////////////////////////////////////////
const saltRounds = 10; // longer the salt, longer the hash time

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR COMPARING PASSWORD
//////////////////////////////////////////////////////
module.exports.comparePassword = (req, res, next) => {
    // Check password
  const callback = (err, isMatch) => {
    if (err) {
      console.error("Error bcrypt:", err);
      res.status(500).json(err);
    } else {
      if (isMatch) {
        next();
      } else {
        res.status(401).json({
          message: "Wrong password",
        });
      }
    }
  };
  bcrypt.compare(req.body.password, res.locals.hash, callback);
};

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR HASHING PASSWORD
//////////////////////////////////////////////////////
module.exports.hashPassword = (req, res, next) => {
    const callback = (err, hash) => {
    if (err) {
      console.error("Error bcrypt:", err);
      res.status(500).json(err);
    } else {
      res.locals.hash = hash; // IMPORTANT: The .hash is the hashed of whatever you want to hash. Name can be anything
      next();
    }
  };

  bcrypt.hash(req.body.password, saltRounds, callback);
};
