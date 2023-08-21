const {Sequelize,Model, DataType, DataTypes} = require("sequelize")
const sequelize = new Sequelize(process.env.POSTGRES_URL)
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'database.sqlite'
// })

class minuteData extends Model {}

minuteData.init({
    totalOpens: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    open_by_countries: {
        type: DataTypes.STRING,
        allowNull: false
    },
    open_by_devices: {
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

