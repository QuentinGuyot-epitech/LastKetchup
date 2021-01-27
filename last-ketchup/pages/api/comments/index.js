import dbconnect from "../../../utils/dbconnect"
import Comment from "../../../models/Comment"

dbconnect()

export default async (req,res) => {
    const { method } = req

    switch(method){
        case 'GET':
            try{
                const comments = await Comment.find({})

                res.status(200).json({success: true, data: comments})
            }catch(err){
                res.status(400).json({success: false})
            }
            break;

        case 'POST':
            try{

                const comment = await Comment.create(req.body)

                res.status(201).json({success:true, data: comment})

            }catch(err){
                res.status(400).json({success:false})
            }
            break;
        default:
        res.status(201).json({success:true})  
        break; 

    }
}

