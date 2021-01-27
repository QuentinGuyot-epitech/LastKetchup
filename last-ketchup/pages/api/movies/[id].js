import dbconnect from '../../../utils/dbconnect'
import Movie from '../../../models/Movie'
import mongoose from "mongoose";
mongoose.set('useFindAndModify', false);


dbconnect();

export default async (req, res) => {
    const {
        query: { id },
        method
    } = req;

    switch (method) {
        case 'GET':
            try {
                const movie = await Movie.findById(id);
                if (!movie) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: movie });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                const movie = await Movie.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!movie) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: movie });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {
                const deletedMovie = await Movie.deleteOne({ _id: id });

                if (!deletedMovie) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: { id } });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}