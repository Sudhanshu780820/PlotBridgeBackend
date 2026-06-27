const Plot = require("../models/Plot");

exports.searchProperties = async (req, res) => {

    try {

        const {
            city,
            budget,
            category,
            minArea,
            maxArea
        } = req.body;

        let query = {
            status: "Available"
        };

        if(city){

            query.location = {
                $regex: city,
                $options: "i"
            };

        }

        if(category){

            query.category = category;

        }

        if(budget){

            query.price = {
                $lte: budget
            };

        }

        if(minArea || maxArea){

            query.size = {};

            if(minArea)
                query.size.$gte = minArea;

            if(maxArea)
                query.size.$lte = maxArea;

        }

        const properties = await Plot.find(query);

        res.json({
            success:true,
            count:properties.length,
            properties
        });

    }

    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}

exports.compareProperties = async(req,res)=>{

    try{

        const { ids } = req.body;

        const properties = await Plot.find({
            _id:{
                $in:ids
            }
        });

        res.json({
            success:true,
            properties
        });

    }

    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}
exports.chatAI = async (req, res) => {
    const { message } = req.body;

    // Later we'll replace this with OpenAI/Botpress logic.

    res.json({
        reply: "You asked: " + message
    });
};