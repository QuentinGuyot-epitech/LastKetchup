import dbconnect from '../../../utils/dbconnect'
import Movie from '../../../models/Movie'

dbconnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const movies = await Movie.find({});
                res.status(200).json({ success: true, data: movies })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            const movie = await Movie.findOne({ api_id: req.body.api_id })
            if (!movie) {
                try {
                    await Movie.create(req.body);
                    res.status(201).json({ success: true, message: "New movie created" })
                } catch (error) {
                    res.status(400).json({ success: false });
                }

            } else {
                return res.status(400).json({ success: false, message: "Movie already in database" })
            }

            break;
    }

}
