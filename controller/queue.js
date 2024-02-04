const queueModel = require("../models/queue");

const dataCreate = async (req, res) => {
    try {
        var success = false;
        var result = [];

        if (req.body.type) {            
            var dataInput = req.body;
            result = await queueModel.dataCreate(dataInput);
            success = true;
        }
        
        res.json({
            success: success,
            message: success ? "Save data success" : "Save data failed, type is required",
            data: result
        });   
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });   
    }
}

module.exports = {
    dataCreate
}