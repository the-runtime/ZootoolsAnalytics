// const {getDB} = require("../database/database");
const {minuteData} = require("../model/minuteStore");

class userTable{
    constructor() {
        this.table = new Map()
        const currentDate = new Date()
        // point1  handle am and pm here

        this.table.set('country', new Map)
        this.table.set('device', new Map)
        this.table.set('count', {time: `${currentDate.getDate()}, ${currentDate.getHours()}:${currentDate.getMinutes()}:0`, count: 0}) //use point1 here

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
        console.log(totalOpens)


        const currentDate = new Date()
        this.table.set('count', {time: `${currentDate.getDate()}, ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`, count: 0}) //use point1 here


        let open_by_devices = ''
        let open_by_countries = ''

        if (totalOpens > 0) {
            open_by_countries = JSON.stringify(Object.fromEntries(this.table.get('country')))
            open_by_devices = JSON.stringify(Object.fromEntries(this.table.get('device')))
        }else {

        }
        await minuteData.create({totalOpens,time,open_by_countries,open_by_devices})
    }
}



module.exports.userTable = userTable
