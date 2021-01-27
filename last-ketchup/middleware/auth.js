const jwt = require('jsonwebtoken');

function auth(req, res) {
    //const token = req.header('x-auth-token');
    const token = req.rawHeaders[1];
    //Check for token 
    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied' })
    try {
        //Verify token 
        const decoded = jwt.verify(token, process.env.JWT);
        //Add user from payload
        req.user = decoded;
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' })
    }
}

module.exports = auth;