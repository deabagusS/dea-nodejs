const visitorsModel = require("../models/visitors");
const model = require("../models/piutang");

const getData = async (req, res) => {
    try{
        const { error } = model.validateConditionGetData(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
        
        const total = await model.getTotal(req.body);
        const data = await model.getDataList(req.body);

        res.json({
            status: true,
            total: total,
            data: data
        });
    }catch (error) {
        res.json({
            status: false,
            message: error.message
        });
    }
};

const changeData = async (req, res) => {
    try{
        const { error } = model.validateConditionGetData(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
        
        const data = await model.getDataList(req.body);
    
        res.json({
            status: true,
            data: data
        });
    }catch (error) {
        res.json({
            status: false,
            message: error.message
        });
    }
}

const updateStatus = async (req, res) => {
    try{
        const { error } = model.validateConditionUpdateStatus(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
    
        const data = await model.updateStatus(req.body.id, 'lunas');
    
        res.json({
            status: true,
            data: data,
            message: 'pembayaran berhasil'
        });
    }catch (error) {
        res.json({
            status: false,
            message: error.message
        });
    }
}

module.exports = {
    getData,
    changeData,
    updateStatus
}