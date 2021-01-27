import dbconnect from "../../../utils/dbconnect"
import Rate from "../../../models/Rate"

dbconnect()

export default async (req, res) => {
    const { method } = req

    switch (method) {
        case 'GET':
            try {
                const rates = await Rate.find({})

                res.status(200).json({ success: true, data: rates })
            } catch (err) {
                res.status(400).json({ success: false })
            }
            break;

        case 'POST':
            try {
                const rate = await Rate.create(req.body)
                res.status(201).json({ success: true, data: rate })
            } catch (err) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(201).json({ success: true })
            break;

    }
}

