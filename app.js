const express = require('express')
const axios = require('axios');
const MongoClient = require('mongodb');
const mongoose = require ('mongoose');
const uri = "mongodb+srv://vastvik:admin@cluster0.alnem.mongodb.net/CurrencyConversion?retryWrites=true&w=majority";
const APIKEY = "05c3c934527f18865b1e"

const Country = require('./schemas/countries')
const Currency = require('./schemas/currency')

const app = express()

app.use(express.json())

//db connection
mongoose.connect(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

//currency conversion
app.post('/convert', (req, res) => {
    var fromCurr = '^' + req.body.fromCurrency + '$'
    Country.findOne({$or: [{currencyId: {'$regex': fromCurr,$options:'i'}}, {name: {'$regex': fromCurr,$options:'i'}}, {alpha3: {'$regex': fromCurr,$options:'i'}}]}, (err1, fromCurrency) => {
        if (err1 || !fromCurrency){
            res.send("fromCurrency not found.");
        }
        else{
            var toCurr = '^' + req.body.toCurrency + '$'
            Country.findOne({$or: [{currencyId:{'$regex': toCurr,$options:'i'}}, {name: {'$regex': toCurr,$options:'i'}}, {alpha3: {'$regex': toCurr,$options:'i'}}]}, (err2, toCurrency) => {
                
                if (err2 || !toCurrency){
                    res.send("toCurrency not found.");
                }
                else {
                    //api call
                    var conversion = `${fromCurrency.currencyId}_${toCurrency.currencyId}`
                    console.log(`conversion string: ${conversion}`);
                    axios.get(`https://free.currconv.com/api/v7/convert?q=${conversion}&compact=ultra&apiKey=${APIKEY}`)
                    .then( (response) => {
                        console.log(response.data);
                        var exchangeRate = response.data[conversion];
                        console.log(exchangeRate);
                        var ans = (req.body.amount * exchangeRate).toFixed(2).toString();
                        console.log(ans);
                        res.send(ans);
                    })
                    .catch( (err) => {
                        res.send("Sorry! Couldnt convert the currency.")
                    })
                }
            })
        }
    })
 
});

//list of countries
// app.get('/countries', (req,res) => {
//     axios.get(`https://free.currconv.com/api/v7/countries?apiKey=${APIKEY}`)
//         .then( (response) => {
//             //console.log(response.data.results);
//             for (let [key, value] of Object.entries(response.data.results)) {
//                 const country = new Country(value);
//                 country.save();
//                 console.log(`${key}: ${JSON.stringify(value)}`);
//             }
//             res.send("{}");
//         });
// });

//list of currencies
// app.get('/currencies', (req,res) => {
//     axios.get(`https://free.currconv.com/api/v7/currencies?apiKey=${APIKEY}`)
//         .then( (response) => {
//             //console.log(response.data.results["INR"]);
//             for (let [key, value] of Object.entries(response.data.results)) {
//                 const currency = new Currency(value);
//                 currency.save();
//                 console.log(`${key}: ${JSON.stringify(value)}`);
//             }
//             res.send("{}");
//         });
// });

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}...`)
});