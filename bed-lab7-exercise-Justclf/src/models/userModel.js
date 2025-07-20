const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
  const SQLSTATMENT = `
  SELECT *
  FROM User;
  `;

pool.query(SQLSTATMENT, callback);
}

module.exports.selectByUsername = (data, callback) =>
{
  const SQLSTATMENT = `
  SELECT id, username, password
  FROM User
  WHERE username = ?
  `
  const VALUES = [data.username]
  pool.query(SQLSTATMENT, VALUES, callback)
}

module.exports.registering = (data, callback) =>
{
  const SQLSTATMENT = `
  INSERT INTO User (username, email, password)
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

