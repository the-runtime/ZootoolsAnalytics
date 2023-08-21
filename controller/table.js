// const {getDB} = require("../database/database");
const {minuteData, sequelize} = require("../model/minuteStore");
const {getLastState} = require("./recoverState");

class userTable{
    constructor() {
        this.table = new Map()
        const currentDate = new Date()
        let formatTime
        if (currentDate.getHours() >= 12){
            if (currentDate.getHours() == 12){
                formatTime = `12:${currentDate.getMinutes()}:00 PM`
            } else{
                formatTime = `${currentDate.getHours() - 12}:${currentDate.getMinutes()}:00 PM`
            }
        } else{
            formatTime = `${currentDate.getHours() }:${currentDate.getMinutes()}:00 AM`
        }
        // point1  handle am and pm here

        this.table.set('country', new Map)
        this.table.set('device', new Map)
        this.table.set('count', {time: `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}, ${formatTime}`, count: 0}) //use point1 here

    }

    gotEvent(country, device) {
        const countryMap = this.table.get('country')
        const deviceMap = this.table.get('device')
        if (!countryMap.has(country)){
            countryMap.set(country,1)
        } else{
            countryMap.set(country,countryMap.get(country) + 1)
        }
        if(!deviceMap.has(device)){
            deviceMap.set(device,1)
        } else {
            deviceMap.set(device, deviceMap.get(device) + 1)
        }

        let minCount = this.table.get('count')
        minCount.count ++


    }

    //runs every 60 secs after first run in nextMinute - currentTime (need to do in app.js)
    async clearCount(){

        //for debugging
        console.log("clearCount executed")

        let time = this.table.get('count').time
        let totalOpens = this.table.get('count').count

        const currentDate = new Date()
        //time formatting
        let formatTime
        if (currentDate.getHours() >= 12){
            if (currentDate.getHours() == 12){
                formatTime = `12:${currentDate.getMinutes()}:${currentDate.getSeconds()} PM`
            } else{
                formatTime = `${currentDate.getHours() - 12}:${currentDate.getMinutes()}:${currentDate.getSeconds()} PM`
            }
        } else{
            formatTime = `${currentDate.getHours() }:${currentDate.getMinutes()}:${currentDate.getSeconds()} AM`
        }


        this.table.set('count', {time: `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}, ${formatTime}`, count: 0}) //use point1 here


        //forgot what I was doing
        // let open_by_devices = ''
        // let open_by_countries = ''

        let open_by_countries = JSON.stringify(Object.fromEntries(this.table.get('country')))
        let open_by_devices = JSON.stringify(Object.fromEntries(this.table.get('device')))
        await minuteData.create({totalOpens,time,open_by_countries,open_by_devices})
    }
}

async function tableFactory(){

    const usertable = new userTable()
    await sequelize.sync()
    console.log("synchronisation of tables done!")
    const lastState = await getLastState()
    if (lastState){
        const countryMap = usertable.table.get('country')
        const deviceMap = usertable.table.get('device')

        const countryData = JSON.parse(lastState.open_by_countries)
        const deviceData = JSON.parse(lastState.open_by_devices)

        for (const [key, value] of Object.entries(countryData)){
            countryMap.set(key, value)
        }

        for(const [key, value] of Object.entries(deviceData)){
            deviceMap.set(key, value)
        }

    }

    console.log('table created')
    return usertable

}

module.exports.tableFactory = tableFactory
// module.exports.userTable = userTable
