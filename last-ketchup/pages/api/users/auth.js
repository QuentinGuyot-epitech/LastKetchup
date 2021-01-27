require('dotenv').config();
import dbconnect from './../../../utils/dbconnect';
import User from '../../../models/User';

dbconnect();

export default async (req, res) => {
    // var User = mongoose.model('user')
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const { method } = req;
    const auth = require('../../../middleware/auth');
    const Cookies = require('cookies');

    switch (method) {
        case 'GET':
            try {
                await auth(req, res);
                await User.findById(req.user.id)
                    .select('-password')
                    .then(user => { res.json(user) });
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;

        // SIGN IN 
        case 'POST':
            const cookies = new Cookies(req, res);
            const { email, password } = new User(req.body);
            const user = await User.findOne({ email });
            const userEmail = await User.findOne({ email: email });

            if (!email || !password) {
                return res.status(400).json({ message: 'Please enter all fields' });
            }

            if (!userEmail) {
                return res.status(400).json({ message: `User with this email:${email} does not exist` })
            }

            // Validate password
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }
                const token = await jwt.sign({ id: user._id }, process.env.JWT, {
                    expiresIn: 3600
                });
                cookies.set('token', token, { expires: new Date(60000 * 60 * 24 + Date.now()) })  // this cookie will expire after 24h of its creation
                res.status(200).json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}