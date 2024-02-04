const { db, ObjectId } = require('../config/database');
const moment = require('moment-timezone');
const Joi = require('joi');
const document = 'piutang';
const collection = db.collection(document);
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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

const exportData = async () => {  
    const csvHeader = [
        {id: 'no_kewajiban', title: 'No Kewajiban'},
        {id: 'no_polisi', title: 'No Polisi'},
        {id: 'pemilik', title: 'Pemilik'},
        {id: 'peserta', title: 'Peserta'},
        {id: 'nomor_va', title: 'Nomor VA'},
        {id: 'harga_terbentuk_rp', title: 'Harga Terbentuk (Rp)'},
        {id: 'biaya_admin_ex_ppn_rp', title: 'Biaya Admin Ex PPN (Rp)'},
        {id: 'ppn_rp', title: 'PPN (Rp)'},
        {id: 'total_rp', title: 'Total (Rp)'},
        {id: 'tanggal_lelang', title: 'Tanggal Lelang'},
        {id: 'tanggal_jatuh_tempo', title: 'Tanggal Jatuh Tempo'},
        {id: 'tanggal_lunas', title: 'Tanggal Lunas'},
        {id: 'status', title: 'Status'},
    ];

    const timestamp = moment().format('YYMMddHHmmss');
    const filename = `exports/piutang_${timestamp}.csv`;
    const csvWriter = createCsvWriter({
        path: filename,
        header: csvHeader,
    });
    
    return {csvWriter, filename};
}

module.exports = {
    getTotal,
    getDataList,
    updateStatus,
    exportData,
    validateConditionGetData,
    validateConditionUpdateStatus
}