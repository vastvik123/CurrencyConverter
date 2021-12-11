const mongoose = require ('mongoose');

const countrySchema = mongoose.Schema({
    id: String,
    name: String,
    currencyId: String,
    currencyName: String,
    currencySymbol: String,
    alpha3: String
})

module.exports = mongoose.model('Country', countrySchema)