const express = require("express");
const nedb = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

console.log(process.env);
const app = express();
app.listen(3000, ()=> {console.log("listening maaan")});
app.use(express.static("public"));
app.use(express.json({ limit : '1mb'}));

const myDB = new nedb('database.db');
myDB.loadDatabase();


app.get('/api', (req, resp) => {

    myDB.find({}, function (err, docs) {
        if(err) {
            resp.end();
            return;
        }
        resp.json(docs);
    });


})


app.post('/api', (req, resp) => {
    console.log("got an requset");
    // console.log(req.body);

    const data = req.body;
    data.timestamp = Date.now();
    myDB.insert(data);

    console.log(data);
    resp.json({
        status : 'success',
        timestamp : data.timestamp,
        lat : data.lat,
        lon : data.lon
    });
});

app.post('/weather/:latlon', async (req, resp) => {
    const latlon = req.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];


    console.log(latlon);
    const weather_api = process.env.WEATHER_API;
    const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api}`;
    const weatherResp = await fetch(weather_url);
    const weatherJson = await weatherResp.json();

    // console.log(weatherJson);


    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aqResp = await fetch(aq_url);
    const aqJson = await aqResp.json();


    resp.json({
        status : 'OK',
        weather : weatherJson,
        aq : aqJson
    });
});