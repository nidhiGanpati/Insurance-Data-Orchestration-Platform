const jwt = require("jsonwebtoken");
const config = require("../../config/local.json");

const JWT_SECRET = config.JWT_SECRET || "CHANGE_ME";

/**
 * Generate an application JWT (HS256)
 * @param {object} payload
 */
const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { ...(config.JWT_CONFIG || {}), algorithm: "HS256" });
};

/**
 * Validate a JWT and return decoded payload
 * @param {string} token
 */
const isValidateToken = (token) => {
  return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
};

module.exports = {
  createToken,
  isValidateToken,
};
