const express = require('express')
const table = require('./controller/table')
const {processEvent} = require("./controller/processEvent");
const {minuteData} = require("./model/minuteStore");
const {factoryTable} = require("./controller/table");

const  app = express()
let userTable

//problem might happen if time in reaching next minute is very less
table.tableFactory()
    .then(retuserTable => {
    userTable = retuserTable
    })


const port = 8000

const currentTime = new Date()
const nextMinute  = new Date()
nextMinute.setMinutes(nextMinute.getMinutes() + 1)
nextMinute.setSeconds(0)
nextMinute.setMilliseconds(0)

//flush data to database every minute
setTimeout(async ()=>{
    await userTable.clearCount()
    // setInterval(userTable.clearCount,5000) this doesn't work probably due to context so using wrapper function works
    setInterval(async () => {
        await userTable.clearCount()
    }, 60000)
},  nextMinute - currentTime)


app.use(express.json())

app.post('/events', (req, res) => {
    const jsonData = req.body
    try {
        const output = processEvent(jsonData)
        userTable.gotEvent(output.country,output.device)
        res.json({message: "message accepted"})
    } catch (err){
        console.log(err.message)
        res.json({message: "problem with payload"})
    }
})

app.get('/metrics',async (req, res) => {
    const timeData = await minuteData.findAll({attributes:['totalOpens','time']})
    const deviceMap = Object.fromEntries(userTable.table.get('device'))
    const countryMap = Object.fromEntries(userTable.table.get('country'))
    res.json({open_by_countries: countryMap, open_by_devices: deviceMap, timeseries: timeData})
})

app.listen(port)