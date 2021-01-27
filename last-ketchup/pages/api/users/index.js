require('dotenv').config();
import dbconnect from './../../../utils/dbconnect';
import User from '../../../models/User';

dbconnect();

export default async (req, res) => {
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const { method } = req;
    const Cookies = require('cookies')

    switch (method) {
        case 'GET':
            try {
                const users = await User.find({});
                res.status(200).json({ success: true, data: users })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        // SIGN UP
        case 'POST':
            //Destructure object newUser
            const cookies = new Cookies(req, res)
            const { username, email, password, isAdmin } = new User(req.body)
            const userUsername = await User.findOne({ username: username })
            const userEmail = await User.findOne({ email: email })
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            if (!username || !email || !password) {
                return res.status(400).json({ message: 'Please enter all fields' });
            }
            if (!salt) throw Error('Something went wrong with bcrypt');

            if (!hash) throw Error('Something went wrong hashing the password');

            if (userUsername) {
                return res.status(400).json({ message: `User already register with this username:${username}` })
            }
            if (userEmail) {
                return res.status(400).json({ message: `User already register with this email:${email}` })
            }
            if (username.length < 3) {
                return res.status(400).json({ message: `Username should be more than 4 characters` })
            } else if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                return res.status(400).json({ message: `${email} is not a valid email` })
            }

            try {
                const newUser = new User({
                    username,
                    email,
                    password: hash,
                    isAdmin: isAdmin
                });

                const savedUser = await newUser.save()
                if (!savedUser) throw Error("Something went wrong while saving the user")
                const token = await jwt.sign({ id: savedUser._id }, process.env.JWT, {
                    expiresIn: 3600
                });
                cookies.set('token', token, { expires: new Date(60000 * 60 * 24 + Date.now()) })  // this cookie will expire after 24h of its creation
                res.status(200).json({
                    token,
                    user: {
                        id: savedUser.id,
                        username: savedUser.name,
                        email: savedUser.email,
                        isAdmin: savedUser.isAdmin
                    }
                });
            } catch (err) {
                res.status(400).json({ msg: err })
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}