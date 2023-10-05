const jwt = require('jsonwebtoken');

const verifyToken = async (event) => {
    const headerToken  = await event.headers.authorization; 
    const token = headerToken.replace('Bearer ','');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;

      } catch(err) {
        // Token is invalid
        throw new Error('Invalid token');
      }
}

module.exports = {
    verifyToken
}