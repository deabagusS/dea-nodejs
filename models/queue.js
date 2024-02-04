const { db, ObjectId } = require('../config/database');
const document = 'queue';
const collection = db.collection(document);
const fillable = [
    'type',
    'number',
    'date',
    'time'
];

const barcodeDate = () => {
    const date = new Date();
    const fullDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
    return fullDate;
}

const addZero = (i) => {
    if (i < 10) {i = "0" + i}
    return i;
}
  
const barcodeTime = () => {
    const d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    let time = h + ":" + m + ":" + s;
    return time
}

const numberFormat = (number) => {
    if (number.toString().length === 1) {
        number = '00'+number;
    } else if(number.toString().length === 2) {
        number = '0'+number;
    }

    return number;
}

const dataCreate = async (dataInput) => {
    var number = await collection.find(
        {
            date: barcodeDate()
        }
    ).count();
    number++;

    const numberString = numberFormat(number);
    const barcode = dataInput.type + numberString;
    const date = barcodeDate();
    const time = barcodeTime();

    const result = await collection.insertOne({
        type: dataInput.type,
        number: numberString,
        barcode: barcode,
        date: date,
        time: time
    });

    return {
        barcode: barcode, 
        datetime: date + ', ' + time
    };
}

module.exports = {
    dataCreate
}