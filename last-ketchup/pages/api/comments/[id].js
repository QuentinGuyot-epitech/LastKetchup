import dbconnect from "../../../utils/dbconnect"
import Comment from "../../../models/Comment"
import mongoose from "mongoose";
mongoose.set('useFindAndModify', false);



dbconnect()


export default async (req,res) => {
    const {
        method,
        query:{id},

    } = req

    switch(method){
        case 'GET':
            try{
                const comment = await Comment.findById(id);

                if(!comment){
                    return res.status(200).json({success:false,message:"Comment not found"})
                }

                res.status(200).json({success: true, data: comment})

            }catch(err){

                res.status(400).json({success: false})
            }
            break;

        case 'PUT':
            ///WE  CAN ADD RESTRICTION//
            try{
                const comment = await Comment.findByIdAndUpdate(id,req.body,{
                    new: true,
                    runValidators: true
                })

                if(!comment){
                    return res.status(400).json({success : false})
                }

                res.status(200).json({success: false, data: comment})


            }catch(err){
                res.status(400).json({success: false})
            }
            break;
        
        case 'DELETE':

        try{
            const deleteComment = await Comment.deleteOne({_id: id})

            if(!deleteComment){
                return res.status(400).json({success: false})
            }

            res.status(200).json({success: true, message:"Deleted successfully" })
        }catch(err){
            res.status(400).json({success: false})
        }
        break;


    }
}