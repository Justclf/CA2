const pool = require('../services/db');


module.exports.registering = (data, callback) =>
{
  const SQLSTATMENT = `
  INSERT INTO user (username, email, password)
  VALUES (?, ?, ?)
  `

  const VALUES = [data.username, data.email, data.password]
  pool.query(SQLSTATMENT, VALUES, callback)
}

module.exports.selectUsernameOrEmail = (data, callback) =>
{
  const SQLSTATEMENT = `
  SELECT id
  FROM User
  WHERE username = ?
  OR email = ?
  `
  const VALUES = [data.username, data.email];

  pool.query(SQLSTATEMENT, VALUES, callback);
}

