const { db, ObjectId } = require('../config/database');
const moment = require('moment-timezone');
const Joi = require('joi');
const document = 'piutang';
const collection = db.collection(document);

const validateConditionGetData = (data) => {
    const scheme = Joi.object({
        condition: Joi.object().keys({
            document_id: Joi.object(),
            destination_site: Joi.object(),
            status: Joi.object(),
            created_time : Joi.object().keys({
                $gte : Joi.date(),
                $lte : Joi.date()
            }),
        }).required(),
        sort: Joi.object(),
        skip: Joi.number().required(),
        limit: Joi.number().required(),
    });
  
    return scheme.validate(data);
};

const validateConditionUpdateStatus = (data) => {
    const scheme = Joi.object({
        id: Joi.array().required()  
    });
  
    return scheme.validate(data);
};

const setCondition = (data) => {
    if (data['created_time']) {
        data['created_time'] = {
            $gte: new Date(data['created_time']['$gte']),
            $lte: new Date(data['created_time']['$lte']),
        };
    }
    
    return data;
};

const getTotal = async (params) => {
    const total = await collection.find(setCondition(params.condition)).count();
    return total;
};

const getDataList = async (params) => {
    const temp = await collection.aggregate([
        {
            $match: setCondition(params.condition)
        },
        {
            $skip: params.skip || 0
        },
        {
            $limit: params.limit || 10
        },
        {
            $sort : {created_time : -1}
        }
    ]);

    const data = await temp.toArray();

    return data;
};

const updateStatus = async (arrayId, status) => {  
    const dataUpdate = {
        status: status,
        tanggal_lunas: moment().tz('Asia/Jakarta').format()
    };

    const update = await collection.updateMany(
        { 
            _id: {
                $in: arrayId.map((id) => new ObjectId(id))
            }
        },
        { $set: dataUpdate }
    );
    
    return update;
};

module.exports = {
    getTotal,
    getDataList,
    updateStatus,
    validateConditionGetData,
    validateConditionUpdateStatus
}