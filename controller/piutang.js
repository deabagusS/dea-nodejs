const visitorsModel = require("../models/visitors");
const model = require("../models/piutang");
const { off } = require("process");

const statusList = [
    { value: 'proses_pembayaran', label: 'Proses Pembayaran' },
    { value: 'konfirmasi_pembayaran', label: 'Konfirmasi Pembayaran' },
    { value: 'lunas', label: 'Lunas' }
]

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

const exportData = async (req, res) => {
    try{
        const { error } = model.validateConditionGetData(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
        
        const data = await model.getDataList(req.body);
        const exportFile = await model.exportData(req.body.id, 'lunas');
        const csvWriter = exportFile.csvWriter;
        const filename = exportFile.filename;

        for(let item of data) {
            item['tanggal_jatuh_tempo'] = new Date(item['tanggal_jatuh_tempo']).toLocaleDateString();
            item['tanggal_lelang'] = new Date(item['tanggal_lelang']).toLocaleDateString();
            item['tanggal_lunas'] = new Date(item['tanggal_lunas']).toLocaleDateString();
            
            const foundObject = statusList.find(object => object.value === item['status']);
            if (foundObject) {
                item['status'] = foundObject.label;
            }
        }
        
        csvWriter.writeRecords(data)
        .then(() => {
            res.download(filename, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            } else {
                require('fs').unlinkSync(filename);
            }
            });
        })
        .catch((err) => {
            console.error('Error writing CSV file:', err);
            res.status(500).send('Internal Server Error');
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
    updateStatus,
    exportData
}