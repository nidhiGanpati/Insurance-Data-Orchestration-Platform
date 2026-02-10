const { isValidateToken } = require("../services/jwt.service");

/**
 * Auth middleware (demo-friendly):
 * - If you are logged in via the web UI, we accept the session cookie.
 * - If you still want to test via API clients, you can send Authorization: Bearer <token>
 */
const auth = async (req, res, next) => {
  try {
    // Session auth (preferred)
    if (req.session && req.session.user) return next();

    // Bearer token auth (optional)
    const header = req.headers["authorization"];
    if (!header) return res.status(401).send("Unauthorized");

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res.status(401).send("Unauthorized");
    }

    const token = parts[1];
    const valid = await isValidateToken(token);
    if (!valid) return res.status(401).send("Unauthorized");

    return next();
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
};

module.exports = { auth };
