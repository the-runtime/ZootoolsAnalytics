const {Sequelize,Model, DataType, DataTypes} = require("sequelize")
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
})

class minuteData extends Model {}

minuteData.init({
    totalOpens: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    open_by_countries: { //more details can be put using enums for country codes
        type: DataTypes.STRING,
        allowNull: false
    },
    open_by_devices: { // moore details can be put using enum for device code
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'minute_store'
})

// sequelize.sync()
//     .then(() => {
//         console.log("synchronisation done")
//     })
module.exports.minuteData = minuteData
module.exports.sequelize = sequelize

