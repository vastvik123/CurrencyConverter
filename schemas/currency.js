const mongoose = require ('mongoose');

const currencySchema = mongoose.Schema({
    id: String,
    currencyName: String,
    currencySymbol: String,
})

module.exports = mongoose.model('Currency', currencySchema)