const mongoose = require('mongoose');
require('../app');
databaseconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL).then((con) => console.log(`Database Connected: ${con.connection.host}`))
    } catch (error) {
        console.log(`database is not connected  ${error}`)
    }
}

module.exports = databaseconnect();