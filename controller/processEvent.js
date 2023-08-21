class processError extends Error{
    constructor(name, message) {
        super(message);
        this.name = name
        this.message = message
    }
}


function processEvent(jsonInput){
    let country
    let device
    if (jsonInput.hasOwnProperty('geo_ip') && jsonInput.geo_ip.hasOwnProperty('country')){
        country = jsonInput.geo_ip.country
    } else {
        throw new processError("country", "country code not found in jsonInput")
    }

    if (jsonInput.hasOwnProperty('user_agent_parsed') && jsonInput.user_agent_parsed.hasOwnProperty('is_mobile')){
        device = jsonInput.user_agent_parsed.is_mobile ? 'mobile' : 'desktop'
    } else {
        throw new processError("device", "device code not found. Check the input payload")
    }

    return {country, device}

}

module.exports.processEvent = processEvent