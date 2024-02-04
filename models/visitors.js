const { db, ObjectId } = require('../config/database');
const document = 'visitors';
const collection = db.collection(document);
const fillable = [
    'customer_name',
    'salesman_id',
    'pic',
    'city',
    'remark',
    'npwp',
    'customer_price_category',
    'address',
    'address_2',
    'contact_no',
    'region',
    'province',
    'kuota',
    'prefered_expedition'
];

const inputFilter = (dataInput) => {
    for (let key in dataInput) {
        if(fillable.includes(key) === false) {                    
            delete dataInput[key];
        }
    }
    
    return dataInput;
}

const getPagination = (page, size) => {
    const limit = size;
    const offset = (size * page) - size;
  
    return { skip: offset, limit: limit };
};  

const dataList = async (search, page, size) => {
    filter = {}

    for (let key in search) {
        filter[key] = {'$regex': search[key]};
    }

    const dataList = await collection.find(inputFilter(filter), getPagination(page, size)).toArray();
    const count = await collection.find(inputFilter(filter)).count();
    
    return {
        visitors : dataList,
        count : count,
        current_page: page,
        size, size
    };
}

const dataFind = async (id) => {
    const findResult = await collection.find({ '_id': new ObjectId(id) }).toArray();
    return findResult;
}

const dataCreate = async (dataInput) => {
    const result = await collection.insertOne(inputFilter(dataInput));
    return result;
}

const dataUpdate = async (id, dataInput) => {
    const result = await collection.updateOne(
        { '_id': new ObjectId(id) },
        {
            $set: inputFilter(dataInput),
        }
    );
    
    return result;
}

const dataDelete = async (id) => {
    const result = await collection.deleteMany({ '_id': new ObjectId(id) });
    return result;
}

module.exports = {
    dataList,
    dataCreate,
    dataUpdate,
    dataDelete,
    dataFind
}