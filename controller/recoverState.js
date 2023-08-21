const {minuteData} = require("../model/minuteStore")

async function getLastState(){
    const latestEntry = await minuteData.findOne({
        order: [['createdAt', 'DESC']]
    })
    return latestEntry

}

module.exports.getLastState = getLastState