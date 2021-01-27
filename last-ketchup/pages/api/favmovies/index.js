import dbconnect from '../../../utils/dbconnect'
import FavMovies from '../../../models/FavMovies'

dbconnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const favmovies = await FavMovies.find({});
                res.status(200).json({ success: true, data: favmovies })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const favmovies = await FavMovies.create(req.body)
                res.status(201).json({ success: true, data: favmovies })
                return favmovies
            } catch (err) {
                res.status(400).json({ success: false })
            }
            break;
    }

}
