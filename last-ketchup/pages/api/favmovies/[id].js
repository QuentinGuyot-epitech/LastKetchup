import dbconnect from "../../../utils/dbconnect"
import FavMovies from '../../../models/FavMovies'
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
                const favmovies = await FavMovies.findById(id);

                if (!favmovies) {
                    return res.status(200).json({ success: false, message: "favmovies not found" })
                }
                res.status(200).json({ success: true, data: favmovies })

            } catch (err) {

                res.status(400).json({ success: false })
            }
            break;

        case 'PUT':
            ///WE  CAN ADD RESTRICTION//
            try {
                const favmovies = await FavMovies.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                })
                if (!favmovies) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: favmovies })
            } catch (err) {
                res.status(400).json({ success: false })
            }
            break;

        case 'DELETE':
            try {
                const deletefavmovies = await FavMovies.deleteOne({ _id: id })

                if (!deletefavmovies) {
                    return res.status(400).json({ success: false })
                }

                res.status(200).json({ success: true, message: "Deleted successfully" })
            } catch (err) {
                res.status(400).json({ success: false })
            }
            break;
    }
}