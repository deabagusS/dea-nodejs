const { db, ObjectId } = require('../config/database');
const moment = require('moment-timezone');
const Joi = require('joi');
const document = 'piutang';
const collection = db.collection(document);

const validateConditionGetData = (data) => {
    const scheme = Joi.object({
        condition: Joi.object(),
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
    const arrayFIlter = ['tanggal_lelang', 'tanggal_jatuh_tempo', 'tanggal_lunas'];

    for(let item of arrayFIlter) {
        if (item in data) {
            if ('$gte' in data[`${item}`]) {
                data[`${item}`]['$gte'] = moment(data[`${item}`]['$gte']).toDate(); //new Date(data[`${item}`]['$gte']);
            }

            if ('$lte' in data[`${item}`]) {
                data[`${item}`]['$lte'] = moment(data[`${item}`]['$lte']).toDate();
            }
        }
    }
    
    return data;
};

const getTotal = async (params) => {
    const total = await collection.find(setCondition(params.condition)).count();
    return total;
};

const getDataList = async (params) => {
    console.log('cekeck 2', setCondition(params.condition));

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
            $sort : {tanggal_lelang : -1}
        }
    ]);

    const data = await temp.toArray();

    return data;
};

const updateStatus = async (arrayId, status) => {  
    const dataUpdate = {
        status: status,
        tanggal_lunas: new Date(moment().tz('Asia/Jakarta').format())
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