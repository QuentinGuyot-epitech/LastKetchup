import dbconnect from "../../../utils/dbconnect"
import Rate from "../../../models/Rate"
import mongoose from "mongoose";
mongoose.set('useFindAndModify', false);



dbconnect()


export default async (req, res) => {
    const {
        method,
        query: { id },
    } = req

    switch (method) {
        case 'GET':
            try {
                const rate = await Rate.findById(id);

                if (!rate) {
                    return res.status(200).json({ success: false, message: "Rate not found" })
                }

                res.status(200).json({ success: true, data: rate })

            } catch (err) {

                res.status(400).json({ success: false })
            }
            break;

        case 'PUT':
            ///WE  CAN ADD RESTRICTION//
            try {
                const rate = await Rate.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                })

                if (!rate) {
                    return res.status(400).json({ success: false })
                }

                res.status(200).json({ success: false, data: rate })


            } catch (err) {
                res.status(400).json({ success: false })
            }
            break;

        case 'DELETE':

            try {
                const deleteRate = await Rate.deleteOne({ _id: id })

                if (!deleteRate) {
                    return res.status(400).json({ success: false })
                }

                res.status(200).json({ success: true, message: "Deleted successfully" })
            } catch (err) {
                res.status(400).json({ success: false })
            }
            break;


    }
}