import dbconnect from './../../../utils/dbconnect';
import mongoose from "mongoose";
import User from '../../../models/User';
mongoose.set('useFindAndModify', false);

dbconnect();

export default async (req, res) => {
    // var User = mongoose.model('user')
    const {
        query: { id },
        method
    } = req;
    const auth = require('../../../middleware/auth');

    switch (method) {
        case 'GET':
            try {
                await auth(req, res);
                const user = await User.findById(id);
                if (!user) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: user })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        case 'PUT':
            try {
                await auth(req, res);
                const user = await User.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!user) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: user })
            } catch (error) {
                return res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {
                await auth(req, res);
                const deleteUser = await User.deleteOne({ _id: id });
                if (!deleteUser) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}