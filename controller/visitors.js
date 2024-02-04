const visitorsModel = require("../models/visitors");

const dataList = async (req, res) => {
    try {
        const filter = req.body?.filter;
        const page = req.body.page ?? 1;
        const size = req.body.size ?? 10;

        const result = await visitorsModel.dataList(req.body?.filter, page, size);
        
        res.json({
            success: result.count > 0 ? true : false,
            message: result.count > 0 ? '' : 'Data not found',
            data: result
        });   
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });   
    }
}

const dataFind = async (req, res) => {
    try {
        const result = await visitorsModel.dataFind(req.params.id);
        
        res.json({
            success: result.length > 0 ? true : false,
            message: result.length > 0 ? '' : 'Data not found',
            data: result.length > 0 ? result[0] : [],
        });   
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });   
    }
}

const dataCreate = async (req, res) => {
    try {
        var success = false;
        var result = [];

        if (req.body.customer_name) {            
            var dataInput = req.body;            
            result = await visitorsModel.dataCreate(dataInput);
            success = true;
        }
        
        res.json({
            success: success,
            message: success ? "Save data success" : "Save data failed, Customer name is required",
            data: result
        });   
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });   
    }
}

const dataUpdate = async (req, res) => {
    try {
        var success = false;
        var result = [];

        if (req.body._id && req.body.customer_name) {            
            var dataInput = req.body;            
            result = await visitorsModel.dataUpdate(req.body._id, dataInput);
            success = true;
        }
        
        res.json({
            success: success,
            message: success ? "Update data success" : "Update data failed, Id and Customer name is required",
            data: result
        });   
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

const dataDelete = async (req, res) => {    
    try {
        var success = false;
        var result = [];

        const dataExsist = await visitorsModel.dataFind(req.params.id);

        if (dataExsist.length > 0) {
            result = await visitorsModel.dataDelete(req.params.id);
            success = true;
        }
        
        res.json({
            success: success,
            message: success ? "Delete data success" : "Delete data failed, data not found",
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
    dataList,
    dataCreate,
    dataUpdate,
    dataDelete,
    dataFind
}